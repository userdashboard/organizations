const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.dashboard.organizations.Invitation.load(req.query.invitationid)
  if (!invitation || invitation.accepted) {
    throw new Error('invalid-invitation')
  }
  const organization = await global.dashboard.organizations.Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  if (req.session.lockURL === req.url && req.session.unlocked >= global.dashboard.Timestamp.now) {
    await global.api.user.organizations.DeleteInvitation.delete(req)
    req.success = true
  }
  req.data = { organization }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const organizationName = doc.getElementById('organizationName')
  organizationName.setAttribute('value', req.data.organization.name)
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'submit-sucess-message') {
      submitForm.remove()
      return global.dashboard.Response.end(req, res, doc)
    }
  }
  return global.dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteInvitation.delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return global.dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, 'unknown-error')
  }
}
