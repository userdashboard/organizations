const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const organizations = await global.organizations.Organization.listAll()
  if (organizations && organizations.length) {
    for (const organization of organizations) {
      organization.created = global.dashboard.Timestamp.date(organization.created)
      organization.createdRelative = global.dashboard.Format.relativePastDate(organization.created)
    }
  }
  const memberships = await global.organizations.Membership.listAll()
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = global.dashboard.Timestamp.date(membership.created)
      membership.createdRelative = global.dashboard.Format.relativePastDate(membership.created)
      const organization = await global.organizations.Organization.load(membership.organizationid)
      membership.organizationName = organization.name
      membership.organizationEmail = organization.email
    }
  }
  req.data = {memberships, organizations}
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
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
  return global.dashboard.Response.end(req, res, doc)
}
