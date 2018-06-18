const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organizationid')
  }
  const count = await global.api.administrator.organizations.OrganizationInvitationsCount.get(req)
  const invitations = await global.api.administrator.organizations.OrganizationInvitations.get(req)
  if (invitations && invitations.length) {
    for (const invitation of invitations) {
      invitation.created = dashboard.Timestamp.date(invitation.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { invitations, count, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  if (req.data.invitations && req.data.invitations.length) {
    dashboard.HTML.renderTable(doc, req.data.invitations, 'invitation-row', 'invitations-table')
    for (const invitation of req.data.invitations) {
      if (invitation.accepted) {
        const notAccepted = doc.getElementById(`not-accepted-${invitation.invitationid}`)
        notAccepted.parentNode.removeChild(notAccepted)
      } else {
        const acceptedElement = doc.getElementById(`accepted-${invitation.invitationid}`)
        acceptedElement.parentNode.removeChild(acceptedElement)
      }
      if (invitation.membershipid) {
        const noMembership = doc.getElementById(`no-membership-${invitation.invitationid}`)
        noMembership.parentNode.removeChild(noMembership)
      } else {
        const membership = doc.getElementById(`membership-${invitation.invitationid}`)
        membership.parentNode.removeChild(membership)
      }
    }
    if (req.data.count < global.PAGE_SIZE) {
      const pageLinks = doc.getElementById('page-links')
      pageLinks.parentNode.removeChild(pageLinks)
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.count)
    }
  }
  return dashboard.Response.end(req, res, doc)
}
