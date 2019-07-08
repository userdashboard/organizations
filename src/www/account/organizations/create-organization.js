const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: renderPage,
  post: submitForm
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
  if (!messageTemplate && req.method === 'GET' && req.query && req.query.returnURL) {
    const submitForm = doc.getElementById('submit-form')
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3F')}`
  }
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
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
    req.query = req.query || {}
    req.query.accountid = req.account.accountid
    const organization = await global.api.user.organizations.CreateOrganization._post(req)
    if (req.success) {
      req.data = { organization }
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, req.error)
  }
}
