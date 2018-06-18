const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    const memberships = await global.api.user.organizations.Memberships.get(req)
    let isMember = false
    for (const membership of memberships) {
      if (membership.organizationid === req.query.organizationid) {
        isMember = true
        break
      }
    }
    if (!isMember) {
      throw new Error('invalid-account')
    }
  }
  organization.created = dashboard.Timestamp.date(organization.created)
  req.data = { organization }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization')
  if (req.data.organization.ownerid !== req.account.accountid) {
    const invitationsLink = doc.getElementById(`invitations-link-${req.query.organizationid}`)
    invitationsLink.parentNode.removeChild(invitationsLink)
    const organizationLink = doc.getElementById(`organization-link-${req.query.organizationid}`)
    organizationLink.parentNode.removeChild(organizationLink)
    const deleteOrganizationLink = doc.getElementById(`delete-organization-link-${req.query.organizationid}`)
    deleteOrganizationLink.parentNode.removeChild(deleteOrganizationLink)
  }
  return dashboard.Response.end(req, res, doc)
}
