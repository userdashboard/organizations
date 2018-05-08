const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitation')
  }
  const invitation = await global.dashboard.organizations.Invitation.load(req.query.invitationid)
  if (!invitation || (invitation.accepted && invitation.accepted !== req.account.accountid)) {
    throw new Error('invalid-invitation')
  }
  const organization = await global.dashboard.organizations.Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (req.account.accountid === organization.ownerid) {
    req.error = 'invalid-account'
    return
  }
  const unique = await global.dashboard.organizations.Membership.isUniqueMembership(invitation.organizationid, req.account.accountid)
  if (!unique) {
    throw new Error('invalid-account')
  }
  req.data = { organization }
  if (req.session.lockURL === req.url && req.session.unlocked >= global.dashboard.Timestamp.now) {
    await global.api.user.organizations.AcceptInvitation.patch(req)
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  } else if (req.error === 'invalid-account') {
    messageTemplate = 'invalid-account'
  }
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const submitForm = doc.getElementById('submitForm')
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.remove()
      return global.dashboard.Response.end(req, res, doc)
    }
  }
  submitForm.setAttribute('action', req.url)
  const nameField = doc.getElementById('organizationName')
  nameField.setAttribute('value', req.data.organization.name)
  return global.dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  try {
    await global.api.user.organizations.AcceptInvitation.patch(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return global.dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    switch (error.message) {
      case 'invalid-invitation-code':
      case 'invalid-invitation-code-length':
      case 'invalid-accountid':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
