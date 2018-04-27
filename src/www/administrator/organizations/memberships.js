const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../membership.js')
const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  const filterid = req.query && req.query.organizationid ? req.query.organizationid : null
  const memberships = await Membership.listAll(filterid)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.created = dashboard.Timestamp.date(membership.created)
      membership.createdRelative = dashboard.Format.relativePastDate(membership.created)
    }
  }
  req.data = { memberships }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  if (req.data.memberships && req.data.memberships.length) {
    doc.renderTable(req.data.memberships, 'membership-row-template', 'memberships-table')
  } else {
    doc.removeElementById('memberships-table')
  }
  return dashboard.Response.end(req, res, doc)
}
