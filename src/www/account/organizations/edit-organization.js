const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organizationid')
  }
  if (req.session.lockURL === req.url && req.session.unlocked) {
    try {
      return global.api.user.organizations.UpdateOrganization.patch(req)
    } catch (error) {
      req.error = error.message
    }
  }
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.data = { organization }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL) {
      return dashboard.Response.redirect(req, res, req.query.returnURL)
    }
    messageTemplate = 'success'
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html)
  const email = req.body ? req.body.email || '' : req.data.organization.email
  const nameField = doc.getElementById('name')
  nameField.setAttribute('value', req.body ? req.body.name || '' : req.data.organization.name)
  const emailField = doc.getElementById('email')
  emailField.setAttribute('value', email)
  const submitForm = doc.getElementById('submit-form')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
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
  if (global.minimumOrganizationNameLength > req.body.name.length ||
    global.maximumOrganizationNameLength < req.body.name.length) {
    return renderPage(req, res, 'invalid-organization-name-length')
  }
  if (!req.body.email || !req.body.email.length) {
    return renderPage(req, res, 'invalid-organization-email')
  }
  try {
    await global.api.user.organizations.UpdateOrganization.patch(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
