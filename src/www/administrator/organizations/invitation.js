const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.organizations.Invitation.load(req.query.invitationid)
  if (!invitation) {
    throw new Error('invalid-invitationid')
  }
  const organization = await global.organizations.Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  invitation.created = global.dashboard.Timestamp.date(invitation.created)
  invitation.createdRelative = global.dashboard.Format.relativePastDate(invitation.created)
  req.data = { invitation }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
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
  return global.dashboard.Response.end(req, res, doc)
}
