const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../membership.js')
const Navigation = require('./navbar.js')
const Organization = require('../../../organization.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await Membership.load(req.query.membershipid)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  const organization = await Organization.load(membership.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  membership.created = dashboard.Timestamp.date(membership.created)
  membership.createdRelative = dashboard.Format.relativePastDate(membership.created)
  req.data = { membership }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.renderTemplate(req.data.membership, 'membership-row-template', 'memberships-table')
  return dashboard.Response.end(req, res, doc)
}
