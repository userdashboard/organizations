const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  const data = await global.api.user.organizations.Invitation.get(req)
  if (!data) {
    throw new Error('invalid-invitationid')
  }
  const invitation = data.invitation
  const organization = data.organization
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  invitation.created = dashboard.Timestamp.date(invitation.created)
  req.data = { invitation }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.renderTemplate(req.data.invitation, 'invitation-row-template', 'invitations-table')
  if (req.data.invitation.accepted) {
    doc.removeElementById('not-accepted')
  } else {
    doc.removeElementById('accepted')
  }
  if (req.data.invitation.membershipid) {
    doc.removeElementById('no-membership')
  } else {
    doc.removeElementById('membership')
  }
  return dashboard.Response.end(req, res, doc)
}
