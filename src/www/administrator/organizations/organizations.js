const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

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
  await Navigation.render(req, doc)
  if (req.data.organizations && req.data.organizations.length) {
    dashboard.HTML.renderTable(doc, req.data.organizations, 'organization-row-template', 'organizations-table')
    if (req.data.count < global.PAGE_SIZE) {
      doc.removeElementById('page-links')
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.count)
    }
  } else {
    doc.removeElementById('organizations-table')
  }
  return dashboard.Response.end(req, res, doc)
}
