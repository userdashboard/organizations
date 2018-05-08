const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.dashboard.organizations.Membership.load(req.query.membershipid)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  const organization = await global.dashboard.organizations.Organization.load(membership.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  membership.created = global.dashboard.Timestamp.date(membership.created)
  membership.createdRelative = global.dashboard.Format.relativePastDate(membership.created)
  req.data = { membership }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.renderTemplate(req.data.membership, 'membership-row-template', 'memberships-table')
  return global.dashboard.Response.end(req, res, doc)
}
