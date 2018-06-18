const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  const count = await global.api.user.organizations.OrganizationsCount.get(req)
  const organizations = await global.api.user.organizations.Organizations.get(req)
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
