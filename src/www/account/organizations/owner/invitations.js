const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

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
  const count = await global.api.user.organizations.OrganizationInvitationsCount.get(req)
  const invitations = await global.api.user.organizations.OrganizationInvitations.get(req)
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
  await Navigation.render(req, doc)
  if (req.data.invitations && req.data.invitations.length) {
    doc.renderTable(req.data.invitations, 'invitation-row-template', 'invitations-table')
    const removeElements = []
    for (const invitation of req.data.invitations) {
      if (invitation.accepted) {
        removeElements.push(`not-accepted-${invitation.invitationid}`)
      } else {
        removeElements.push(`accepted-${invitation.invitationid}`)
      }
      if (invitation.membershipid) {
        removeElements.push(`no-membership-${invitation.invitationid}`)
      } else {
        removeElements.push(`membership-${invitation.invitationid}`)
      }
    }
    doc.removeElementsById(removeElements)
    if (req.data.count < global.PAGE_SIZE) {
      doc.removeElementById('page-links')
    } else {
      doc.renderPagination(req.data.offset, req.data.count)
    }
  }
  return dashboard.Response.end(req, res, doc)
}
