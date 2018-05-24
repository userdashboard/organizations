const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

module.exports = {
  get: renderPage,
  post: submitForm
}

async function renderPage (req, res, messageTemplate) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success') {
      doc.removeElementById('submitForm')
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.body) {
    const nameField = doc.getElementById('name')
    nameField.setAttribute('value', req.body.name || '')
    const emailField = doc.getElementById('email')
    emailField.setAttribute('value', req.body.email || '')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.name) {
    return renderPage(req, res, 'invalid-organization-name')
  }
  if (global.MINIMUM_ORGANIZATION_NAME_LENGTH > req.body.name.length ||
    global.MAXIMUM_ORGANIZATION_NAME_LENGTH < req.body.name.length) {
    return renderPage(req, res, 'invalid-organization-name-length')
  }
  for (const property in req.body) {
    if (property === 'name') {
      continue
    }
    if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
      return renderPage(req, res, 'invalid-organization-field')
    }
    if (global.MAXIMUM_ORGANIZATION_FIELD_LENGTH < req.body[property].length) {
      return renderPage(req, res, 'invalid-organization-field-length')
    }
  }
  try {
    await global.api.user.organizations.CreateOrganization.post(req)
    return renderPage(req, res, 'success')
  } catch (error) {
    switch (error.message) {
      case 'invalid-organization-name':
      case 'invalid-organization-name-length':
      case 'invalid-organization-field':
      case 'invalid-organization-field-length':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
