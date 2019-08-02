const dashboard = require('@userdashboard/dashboard')
const navbar = require('./navbar-membership.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.api.user.organizations.Membership.get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (membership.accountid !== req.account.accountid && organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  membership.createdFormatted = dashboard.Format.date(membership.created)
  req.data = { organization, membership }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.membership, 'membership')
  await navbar.setup(doc, req.data.organization, req.account)
  return dashboard.Response.end(req, res, doc)
}
