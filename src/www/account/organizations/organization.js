const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  const organization = await global.dashboard.organizations.Organization.load(req.query.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    const unique = await global.dashboard.organizations.Membership.isUniqueMembership(req.query.organizationid, req.account.accountid)
    if (unique) {
      throw new Error('invalid-account')
    }
  }
  organization.created = global.dashboard.Timestamp.date(organization.created)
  organization.createdRelative = global.dashboard.Format.relativePastDate(organization.created)
  req.data = { organization }
}

async function renderPage (req, res) {
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.renderTemplate(req.data.organization, 'organization-row-template', 'organizations-table')
  if (req.data.organization.ownerid !== req.account.accountid) {
    doc.removeElementsById([
      `invitations-link-${req.query.organizationid}`,
      `edit-organization-link-${req.query.organizationid}`,
      `delete-organization-link-${req.query.organizationid}`
    ])
  }
  return global.dashboard.Response.end(req, res, doc)
}
