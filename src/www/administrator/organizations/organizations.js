const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  let allOrganizations = await global.api.administrator.organizations.Organizations.get(req)
  if (allOrganizations && allOrganizations.length) {
    for (const organization of allOrganizations) {
      organization.created = dashboard.Timestamp.date(organization.created)
    }
  }
  req.data = { organizations: allOrganizations }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.organizations && req.data.organizations.length) {
    doc.renderTable(req.data.organizations, 'organization-row-template', 'organizations-table')
  }
  return dashboard.Response.end(req, res, doc)
}
