const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const ownedOrganizations = await global.dashboard.organizations.Organization.list(req.account.accountid)
  if (ownedOrganizations && ownedOrganizations.length) {
    for (const organization of ownedOrganizations) {
      organization.created = global.dashboard.Timestamp.date(organization.created)
      organization.createdRelative = global.dashboard.Format.relativePastDate(organization.created)
    }
  }
  req.data = { organizations: ownedOrganizations }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.organizations && req.data.organizations.length) {
    doc.renderTable(req.data.organizations, 'organization-row-template', 'organizations-table')
  }
  return global.dashboard.Response.end(req, res, doc)
}
