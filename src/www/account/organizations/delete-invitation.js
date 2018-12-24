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
    try {
      return global.api.user.organizations.DeleteInvitation.delete(req)
    } catch (error) {
      req.error = error.message
    }
  }
  const invitation = await global.api.user.organizations.Invitation.get(req)
  if (invitation.accepted) {
    throw new Error('invalid-invitation')
  }
  req.query.organizationid = invitation.organizationid
  const organization = await global.api.user.organizations.Organization.get(req)
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  invitation.createdFormatted = dashboard.Timestamp.date(invitation.created)
  req.data = { organization, invitation }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL) {
      return dashboard.Response.redirect(req, res, req.query.returnURL)
    }
    return dashboard.Response.redirect(req, res, `/account/organizations/organization-invitations?organizationid=${req.data.organization.organizationid}`)
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.invitation, 'invitation')
  const organizationName = doc.getElementById('organizationName')
  organizationName.setAttribute('value', req.data.organization.name)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'submit-sucess-message') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteInvitation.delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
