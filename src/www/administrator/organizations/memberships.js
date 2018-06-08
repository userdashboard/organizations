const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const count = await global.api.administrator.organizations.MembershipsCount.get(req)
  const memberships = await global.api.administrator.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = dashboard.Timestamp.date(membership.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { memberships, count, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.memberships && req.data.memberships.length) {
    doc.renderTable(req.data.memberships, 'membership-row-template', 'memberships-table')
    if (req.data.count < global.PAGE_SIZE) {
      doc.removeElementById('page-links')
    } else {
      doc.renderPagination(req.data.offset, req.data.count)
    }
  } else {
    doc.removeElementById('memberships-table')
  }
  return dashboard.Response.end(req, res, doc)
}
