const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  const ownedOrganizations = await global.api.user.organizations.Organizations.get(req)
  if (ownedOrganizations && ownedOrganizations.length) {
    for (const organization of ownedOrganizations) {
      organization.created = dashboard.Timestamp.date(organization.created)
    }
  }
  const memberships = await global.api.user.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = dashboard.Timestamp.date(membership.created)
      req.query.organizationid = membership.organizationid
      const organization = await global.api.user.organizations.Organization.get(req)
      membership.organizationName = organization.name
      membership.organizationEmail = organization.email
    }
  }
  req.data = {memberships, organizations: ownedOrganizations}
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  if (req.data.memberships && req.data.memberships.length) {
    dashboard.HTML.renderTable(doc, req.data.memberships, 'membership-row', 'memberships-table')
  } else {
    const membershipsTable = doc.getElementById('memberships-table')
    membershipsTable.parentNode.removeChild(membershipsTable)
  }
  if (req.data.organizations && req.data.organizations.length) {
    dashboard.HTML.renderTable(doc, req.data.organizations, 'organization-row', 'organizations-table')
  } else {
    const organizationsTable = doc.getElementById('organizations-table')
    organizationsTable.parentNode.removeChild(organizationsTable)
  }
  return dashboard.Response.end(req, res, doc)
}
