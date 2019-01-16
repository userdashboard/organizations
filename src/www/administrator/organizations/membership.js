const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.api.administrator.organizations.Membership._get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.administrator.organizations.Organization._get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  membership.createdFormatted = dashboard.Timestamp.date(membership.created)
  req.data = { membership }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.membership, 'membership')
  return dashboard.Response.end(req, res, doc)
}
