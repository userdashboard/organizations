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
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.data = {organization}
  if (req.session.lockURL === req.url && req.session.unlocked >= dashboard.Timestamp.now) {
    await global.api.user.organizations.UpdateOrganization.patch(req)
    req.success = true
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
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
  for (const property in req.body) {
    if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
      return renderPage(req, res, 'invalid-organization-field')
    }
    if (global.MAXIMUM_ORGANIZATION_FIELD_LENGTH < req.body[property].length) {
      return renderPage(req, res, 'invalid-organization-field-length')
    }
  }
  try {
    await global.api.user.organizations.UpdateOrganization.patch(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    switch (error.message) {
      case 'invalid-organization-field':
      case 'invalid-organization-field-length':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
