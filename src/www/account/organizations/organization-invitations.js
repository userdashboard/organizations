const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organizationid')
  }
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.query.accountid = req.account.accountid
  const total = await global.api.user.organizations.InvitationsCount.get(req)
  const invitations = await global.api.user.organizations.Invitations.get(req)
  if (invitations && invitations.length) {
    for (const invitation of invitations) {
      invitation.createdFormatted = dashboard.Format.date(invitation.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { organization, invitations, total, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.organization, 'organization')
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
