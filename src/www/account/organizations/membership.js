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
  const removeFields = [].concat(global.profileFields)
    const usedFields = []
    for (const field of removeFields) {
      if (usedFields.indexOf(field) > -1) {
        continue
      }
      if (field === 'full-name') {
        if (req.data.membership.firstName &&
          removeFields.indexOf('full-name') > -1 &&
          usedFields.indexOf(field) === -1) {
          usedFields.push(field)
        }
        continue
      }
      const displayName = global.profileFieldMap[field]
      if (req.data.membership[displayName] &&
        removeFields.indexOf(field) > -1 &&
        usedFields.indexOf(field) === -1) {
        usedFields.push(field)
      }
    }
    for (const id of removeFields) {
      if (usedFields.indexOf(id) === -1) {
        const element = doc.getElementById(id)
        element.parentNode.removeChild(element)
      }
    }
    return dashboard.Response.end(req, res, doc)
}
