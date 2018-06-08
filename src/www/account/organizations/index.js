const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  const ownedOrganizations = await global.api.user.organizations.Organizations.get(req)
  if (ownedOrganizations && ownedOrganizations.length) {
    for (const organization of ownedOrganizations) {
      organization.created = dashboard.Timestamp.date(organization.created)
    }
  }
  const memberships = await global.api.user.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = dashboard.Timestamp.date(membership.created)
      req.query.organizationid = membership.organizationid
      const organization = await global.api.user.organizations.Organization.get(req)
      membership.organizationName = organization.name
      membership.organizationEmail = organization.email
    }
  }
  req.data = {memberships, organizations: ownedOrganizations}
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.memberships && req.data.memberships.length) {
    doc.renderTable(req.data.memberships, 'membership-row-template', 'memberships-table')
  } else {
    doc.removeElementById('memberships-table')
  }
  if (req.data.organizations && req.data.organizations.length) {
    doc.renderTable(req.data.organizations, 'organization-row-template', 'organizations-table')
  } else {
    doc.removeElementById('organizations-table')
  }
  return dashboard.Response.end(req, res, doc)
}
