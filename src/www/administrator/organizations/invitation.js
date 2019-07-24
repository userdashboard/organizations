const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.api.administrator.organizations.Invitation.get(req)
  if (!invitation) {
    throw new Error('invalid-invitationid')
  }
  req.query.organizationid = invitation.organizationid
  const organization = await global.api.administrator.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  invitation.createdFormatted = dashboard.Timestamp.date(invitation.created)
  req.data = { invitation }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.invitation, 'invitation')
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
