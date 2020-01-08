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
    const requiredFields = req.userProfileFields || global.membershipProfileFields
    for (const profile of profiles) {
      let include = true
      for (const field of requiredFields) {
        if (field === 'full-name') {
          if (!profile.firstName || !profile.lastName) {
            include = false
            break
          }
        }
        const displayName = global.profileFieldMap[field]
        include = profile[displayName] && profile[displayName].length
        if (!include) {
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
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  const doc = dashboard.HTML.parse(req.route.html)
  const submitForm = doc.getElementById('submit-form')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.data && req.data.profiles && req.data.profiles.length) {
    dashboard.HTML.renderList(doc, req.data.profiles, 'profile-option', 'profileid')
  }
  if (req.body) {
    const idField = doc.getElementById('invitationid')
    idField.setAttribute('value', req.body.invitationid || '')
    const codeField = doc.getElementById('secret-code')
    codeField.setAttribute('value', req.body['secret-code'] || '')
    if (req.body.profileid) {
      dashboard.HTML.setSelectedOptionByValue(doc, 'profileid', req.body.profileid)
    } else {
      const profileFields = req.userProfileFields || global.membershipProfileFields
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
    if (req.account.accountid === organization.ownerid) {
      return renderPage(req, res, 'invalid-account')
    }
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
      req.query.profileid = req.body.profileid
      let profile
      try {
        profile = await global.api.user.Profile.get(req)
      } catch (error) {
        return renderPage(req, res, error.message)
      }
      if (!profile) {
        return renderPage(req, res, 'invalid-profileid')
      }
    }
  } else {
    req.userProfileFields = req.userProfileFields || global.membershipProfileFields
    for (const field of req.userProfileFields) {
      if (req.body[field] && req.body[field].trim) {
        req.body[field] = req.body[field].trim()
      }
    }
    try {
      const profile = await global.api.user.CreateProfile.post(req)
      req.body.profileid = profile.profileid
    } catch (error) {
      return renderPage(req, res, error.message)
    }
  }
  try {
    await global.api.user.organizations.CreateMembership.post(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?message=success`
    })
    return res.end()
  }
}
