const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const total = await global.api.administrator.organizations.InvitationsCount.get(req)
  const invitations = await global.api.administrator.organizations.Invitations.get(req)
  if (invitations && invitations.length) {
    for (const invitation of invitations) {
      invitation.createdFormatted = dashboard.Format.date(invitation.created)
      if (invitation.accepted) {
        invitation.acceptedFormatted = dashboard.Format.date(invitation.accepted)
      }
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { invitations, total, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.html || req.route.html, null, null, req.language)
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
    if (req.data.total <= global.pageSize) {
      const pageLinks = doc.getElementById('page-links')
      pageLinks.parentNode.removeChild(pageLinks)
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.total)
    }
    const noInvitations = doc.getElementById('no-invitations')
    noInvitations.parentNode.removeChild(noInvitations)
  } else {
    const invitationsTable = doc.getElementById('invitations-table')
    invitationsTable.parentNode.removeChild(invitationsTable)
  }
  return dashboard.Response.end(req, res, doc)
}
