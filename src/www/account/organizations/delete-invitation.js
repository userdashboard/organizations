const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
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
  invitation.createdFormatted = dashboard.Format.date(invitation.created)
  req.data = { organization, invitation }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
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
  if (req.data.invitation.accepted) {
    const notAccepted = doc.getElementById('not-accepted')
    notAccepted.parentNode.removeChild(notAccepted)
  } else {
    const accepted = doc.getElementById('accepted')
    accepted.parentNode.removeChild(accepted)
  }
  if (req.data.invitation.membershipid) {
    const noMembership = doc.getElementById('no-membership')
    noMembership.parentNode.removeChild(noMembership)
  } else {
    const membership = doc.getElementById('membership')
    membership.parentNode.removeChild(membership)
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteInvitation.delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
