const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  const organization = await global.dashboard.organizations.Organization.load(req.query.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.data = { organization }
  if (req.session.lockURL === req.url && req.session.unlocked >= global.dashboard.Timestamp.now) {
    await global.api.user.organizations.CreateInvitation.post(req)
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.getElementById('organizationName').setAttribute('value', req.data.organization.name)
  doc.getElementById('code').setAttribute('value', req.body ? req.body.code : global.dashboard.UUID.random(10))
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(req.data.invitation, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success') {
      submitForm.remove()
    }
  }
  return global.dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.code) {
    return renderPage(req, res, 'invalid-invitation-code')
  }
  try {
    await global.api.user.organizations.CreateInvitation.post(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return global.dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, 'unknown-error')
  }
}
