const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

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
  membership.created = dashboard.Timestamp.date(membership.created)
  req.data = { membership }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  dashboard.HTML.renderTemplate(doc, req.data.membership, 'membership-row-template', 'memberships-table')
  return dashboard.Response.end(req, res, doc)
}
