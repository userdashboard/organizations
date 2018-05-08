const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const filterid = req.query && req.query.accountid ? req.query.accountid : null
  let allOrganizations = await global.dashboard.organizations.Organization.listAll(filterid)
  if (allOrganizations && allOrganizations.length) {
    for (const organization of allOrganizations) {
      organization.created = global.dashboard.Timestamp.date(organization.created)
      organization.createdRelative = global.dashboard.Format.relativePastDate(organization.created)
    }
  }
  req.data = { organizations: allOrganizations }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.organizations && req.data.organizations.length) {
    doc.renderTable(req.data.organizations, 'organization-row-template', 'organizations-table')
  }
  return global.dashboard.Response.end(req, res, doc)
}
