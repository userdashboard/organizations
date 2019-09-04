const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  req.query.all = true
  const profiles = await global.api.user.Profiles.get(req)
  const validProfiles = []
  if (profiles && profiles.length) {
    const requiredFields = req.profileFields || global.membershipProfileFields
    for (const profile of profiles) {
      let include = true
      for (const field of requiredFields) {
        let displayName = field
        if (displayName.indexOf('-') > -1) {
          displayName = displayName.split('-')
          if (displayName.length === 1) {
            displayName = displayName[0]
          } else if (displayName.length === 2) {
            displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1)
          } else if (displayName.length === 3) {
            displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1) + displayName[2].substring(0, 1).toUpperCase() + displayName[2].substring(1)
          }
        }
        include = profile[displayName] && profile[displayName].length
        if (include) {
          break
        }
      }
      if (include) {
        validProfiles.push(profile)
      }
    }
  }
  if (validProfiles && validProfiles.length) {
    req.data = {
      profiles: validProfiles
    }
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
    }
    return dashboard.Response.redirect(req, res, `/account/organizations/membership?membershipid=${req.data.membership.membershipid}`)
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html)
  const submitForm = doc.getElementById('submit-form')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.query && req.query.returnURL) {
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3F')}`
  }
  if (req.data && req.data.profiles && req.data.profiles.length) {
    dashboard.HTML.renderList(doc, req.data.profiles, 'profile-option', 'profileid')
  }
  if (req.body) {
    const idField = doc.getElementById('invitationid')
    idField.setAttribute('value', req.body.invitationid || '')
    const codeField = doc.getElementById('code')
    codeField.setAttribute('value', req.body.code || '')
    if (req.body.profileid) {
      dashboard.HTML.setSelectedOptionByValue(doc, 'profileid', req.body.profileid)
    } else {
      const profileFields = global.membershipProfileFields
      for (const field of profileFields) {
        if (req.body[field]) {
          const element = doc.getElementById(field)
          element.setAttribute('value', req.body[field])
        }
      }
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.invitationid || !req.body.invitationid.length) {
    return renderPage(req, res, 'invalid-invitationid')
  }
  req.query = req.query || {}
  req.query.invitationid = req.body.invitationid
  try {
    const invitation = await global.api.user.organizations.OpenInvitation.get(req)
    if (invitation.accepted) {
      return renderPage(req, res, 'invalid-invitation')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.user.organizations.OpenInvitationOrganization.get(req)
    // prevent organization owner
    if (req.account.accountid === organization.ownerid) {
      return renderPage(req, res, 'invalid-account')
    }
    // prevent organization members
    let membership
    try {
      req.query.organizationid = organization.organizationid
      membership = await global.api.user.organizations.OrganizationMembership.get(req)
    } catch (error) {
    }
    if (membership) {
      return renderPage(req, res, 'invalid-account')
    }
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.body.profileid) {
    if (!req.data || !req.data.profiles || !req.data.profiles.length) {
      return renderPage(req, res, 'invalid-profileid')
    }
    let found = false
    for (const profile of req.data.profiles) {
      found = profile.profileid === req.body.profileid
      if (found) {
        break
      }
    }
    if (!found) {
      return renderPage(req, res, 'invalid-profileid')
    }
  } else {
    req.profileFields = req.profileFields || global.membershipProfileFields
    try {
      const profile = await global.api.user.CreateProfile.post(req)
      req.body.profileid = profile.profileid
      req.success = false
    } catch (error) {
      return renderPage(req, res, error.message)
    }
  }
  try {
    const membership = await global.api.user.organizations.CreateMembership.post(req)
    if (req.success) {
      req.data = { membership }
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
