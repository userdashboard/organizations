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
        if (field === 'full-name') {
          if (!profile.firstName || !profile.lastName) {
            include = false
            break
          }
        }
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
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
    }
    return dashboard.Response.redirect(req, res, `/account/organizations/organization?organizationid=${req.data.organization.organizationid}`)
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html)

  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.data && req.data.profiles && req.data.profiles.length) {
    dashboard.HTML.renderList(doc, req.data.profiles, 'profile-option', 'profileid')
  }
  if (req.body) {
    const nameField = doc.getElementById('name')
    nameField.setAttribute('value', req.body.name || '')
    const emailField = doc.getElementById('email')
    emailField.setAttribute('value', req.body.email || '')
    if (req.body.profileid) {
      dashboard.HTML.setSelectedOptionByValue(doc, 'profileid', req.body.profileid)
    } else {
      const profileFields = req.profileFields || global.membershipProfileFields
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
  if (!req.body.name || !req.body.name.length) {
    return renderPage(req, res, 'invalid-organization-name')
  }
  req.body.name = req.body.name.trim ? req.body.name.trim() : req.body.name
  if (global.minimumOrganizationNameLength > req.body.name.length ||
    global.maximumOrganizationNameLength < req.body.name.length) {
    return renderPage(req, res, 'invalid-organization-name-length')
  }
  req.body.email = req.body.email && req.body.email.trim ? req.body.email.trim() : req.body.email
  if (!req.body.email || !req.body.email.length) {
    return renderPage(req, res, 'invalid-organization-email')
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
    for (const field of req.profileFields) {
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
    req.query = req.query || {}
    req.query.accountid = req.account.accountid
    const organization = await global.api.user.organizations.CreateOrganization.post(req)
    await dashboard.StorageList.add(`${req.appid}/profileUsage/${req.body.profileid}`, organization.organizationid)
    if (req.success) {
      req.data = { organization }
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, req.error)
  }
}
