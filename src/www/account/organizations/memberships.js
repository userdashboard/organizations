const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const memberships = await global.dashboard.organizations.Membership.listByAccount(req.account.accountid)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = global.dashboard.Timestamp.date(membership.created)
      membership.createdRelative = global.dashboard.Format.relativePastDate(membership.created)
      const organization = await global.dashboard.organizations.Organization.load(membership.organizationid)
      membership.organizationName = organization.name
      membership.organizationEmail = organization.email
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
