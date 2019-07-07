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
  const invitation = await global.api.user.organizations.Invitation._get(req)
  if (invitation.accepted) {
    throw new Error('invalid-invitation')
  }
  req.query.organizationid = invitation.organizationid
  const organization = await global.api.user.organizations.Organization._get(req)
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  invitation.createdFormatted = dashboard.Timestamp.date(invitation.created)
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
  if (!messageTemplate && req.method === 'GET' && req.query && req.query.returnURL) {
    const submitForm = doc.getElementById('submit-form')
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3F')}`
  }
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
    await global.api.user.organizations.DeleteInvitation._delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
