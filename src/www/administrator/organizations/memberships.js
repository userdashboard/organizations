const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const filterid = req.query && req.query.organizationid ? req.query.organizationid : null
  const memberships = await global.organizations.Membership.listAll(filterid)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = global.dashboard.Timestamp.date(membership.created)
      membership.createdRelative = global.dashboard.Format.relativePastDate(membership.created)
    }
  }
  req.data = { memberships }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.memberships && req.data.memberships.length) {
    doc.renderTable(req.data.memberships, 'membership-row-template', 'memberships-table')
  } else {
    doc.removeElementById('memberships-table')
  }
  return global.dashboard.Response.end(req, res, doc)
}
