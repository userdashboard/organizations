const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  if (req.session.lockURL === req.url && req.session.unlocked) {
    await global.api.user.organizations.CreateMembership.post(req)
    if (req.success) {
      return
    }
  }
  const data = await global.api.user.organizations.OpenInvitation.get(req)
  const invitation = data.invitation
  const organization = data.organization
  if (invitation.accepted && invitation.accepted !== req.account.accountid) {
    throw new Error('invalid-invitation')
  }
  if (req.account.accountid === organization.ownerid) {
    throw new Error('invalid-account')
  }
  req.query.accountid = req.account.accountid
  const memberships = await global.api.user.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      if (membership.organizationid === organization.organizationid) {
        throw new Error('invalid-account')
      }
    }
  }
  req.data = { organization }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization')
  const submitForm = doc.getElementById('submit-form')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  submitForm.setAttribute('action', req.url)
  const nameField = doc.getElementById('organizationName')
  nameField.setAttribute('value', req.data.organization.name)
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  try {
    await global.api.user.organizations.CreateMembership.post(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
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
