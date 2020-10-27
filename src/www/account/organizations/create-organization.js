const dashboard = require('@userdashboard/dashboard')
const organizations = require('../../../../index.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  req.query = req.query || {}
  if (req.query.message === 'success') {
    req.data = {
      organization: {
        object: 'organization',
        organizationid: req.query.organizationid
      }
    }
    return
  }
  req.query.accountid = req.account.accountid
  req.query.all = true
  req.storage = organizations
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
  const doc = dashboard.HTML.parse(req.html || req.route.html, null, null, req.language)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, req.data ? req.data.organization : null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  const profileFields = req.userProfileFields || global.membershipProfileFields
  const removeFields = [].concat(global.profileFields)
  if (req.data && req.data.profiles && req.data.profiles.length) {
    dashboard.HTML.renderList(doc, req.data.profiles, 'profile-option', 'profileid')
  } else {
    removeFields.push('existing-profile')
  }
  for (const field of profileFields) {
    removeFields.splice(removeFields.indexOf(field), 1)
  }
  for (const id of removeFields) {
    const element = doc.getElementById(`${id}-container`)
    if (!element || !element.parentNode) {
      continue
    }
    element.parentNode.removeChild(element)
  }
  if (req.body) {
    const nameField = doc.getElementById('name')
    nameField.setAttribute('value', (req.body.name || '').split("'").join('&quot;'))
    const emailField = doc.getElementById('email')
    emailField.setAttribute('value', (req.body.email || '').split("'").join('&quot;'))
    if (req.body.profileid) {
      dashboard.HTML.setSelectedOptionByValue(doc, 'profileid', (req.body.profileid || '').split("'").join('&quot;'))
    }
    for (const field of profileFields) {
      if (req.body[field]) {
        const element = doc.getElementById(field)
        element.setAttribute('value', (req.body[field]).split("'").join('&quot;'))
      }
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (req.query && req.query.message === 'success') {
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
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  let organization
  try {
    organization = await global.api.user.organizations.CreateOrganization.post(req)
  } catch (error) {
    return renderPage(req, res, req.error)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?organizationid=${organization.organizationid}&message=success`
    })
    return res.end()
  }
}
