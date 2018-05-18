const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.organizations.Membership.load(req.query.membershipid)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  const organization = await global.organizations.Organization.load(membership.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (membership.accountid !== req.account.account && organization.ownerid !== req.account.accountid) {
    const unique = await global.organizations.Membership.isUniqueMembership(membership.organizationid, req.account.accountid)
    if (unique) {
      throw new Error('invalid-account')
    }
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
