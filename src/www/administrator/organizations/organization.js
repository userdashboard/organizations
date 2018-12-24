const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  const organization = await global.api.administrator.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  organization.createdFormatted = dashboard.Timestamp.date(organization.created)
  req.data = { organization }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization')
  return dashboard.Response.end(req, res, doc)
}
