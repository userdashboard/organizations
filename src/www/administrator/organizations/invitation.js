const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../invitation.js')
const Navigation = require('./navbar.js')
const Organization = require('../../../organization.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await Invitation.load(req.query.invitationid)
  if (!invitation) {
    throw new Error('invalid-invitationid')
  }
  const organization = await Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  invitation.created = dashboard.Timestamp.date(invitation.created)
  invitation.createdRelative = dashboard.Format.relativePastDate(invitation.created)
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
