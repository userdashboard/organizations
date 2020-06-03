const dashboard = require('@userdashboard/dashboard')

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
    let membership
    try {
      membership = await global.api.user.organizations.OrganizationMembership.get(req)
    } catch (error) {
    }
    if (!membership) {
      throw new Error('invalid-account')
    }
  }
  organization.createdFormatted = dashboard.Format.date(organization.created)
  req.data = { organization }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization', req.language)
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
