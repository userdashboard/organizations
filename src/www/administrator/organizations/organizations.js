const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const count = await global.api.administrator.organizations.OrganizationsCount.get(req)
  let organizations = await global.api.administrator.organizations.Organizations.get(req)
  if (organizations && organizations.length) {
    for (const organization of organizations) {
      organization.created = dashboard.Timestamp.date(organization.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { organizations, count, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  if (req.data.organizations && req.data.organizations.length) {
    dashboard.HTML.renderTable(doc, req.data.organizations, 'organization-row', 'organizations-table')
    if (req.data.count < global.PAGE_SIZE) {
      const pageLinks = doc.getElementById('page-links')
      pageLinks.parentNode.removeChild(pageLinks)
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.count)
    }
  } else {
    const organizationsTable = doc.getElementById('organizations-table')
    organizationsTable.parentNode.removeChild(organizationsTable)
  }
  return dashboard.Response.end(req, res, doc)
}
