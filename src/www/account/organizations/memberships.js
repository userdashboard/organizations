const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  const count = await global.api.user.organizations.MembershipsCount.get(req)
  const memberships = await global.api.user.organizations.Memberships.get(req)
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
  if (req.data.memberships && req.data.memberships.length) {
    dashboard.HTML.renderTable(doc, req.data.memberships, 'membership-row', 'memberships-table')
    if (req.data.count < global.PAGE_SIZE) {
      const pageLinks = doc.getElementById('page-links')
      pageLinks.parentNode.removeChild(pageLinks)
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.count)
    }
  } else {
    const membershipsTable = doc.getElementById('memberships-table')
    membershipsTable.parentNode.removeChild(membershipsTable)
  }
  return dashboard.Response.end(req, res, doc)
}
