
const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organizationid)')
  }
  const organization = await global.api.administrator.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  const total = await global.api.administrator.organizations.MembershipsCount.get(req)
  const memberships = await global.api.administrator.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.createdFormatted = dashboard.Format.date(membership.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { organization, memberships, total, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.html || req.route.html)
  const removeElements = []
  if (req.data.memberships && req.data.memberships.length) {
    const removeFields = [].concat(global.profileFields)
    const usedFields = []
    for (const membership of req.data.memberships) {
      for (const field of removeFields) {
        if (usedFields.indexOf(field) > -1) {
          continue
        }
        if (field === 'full-name') {
          if (membership.firstName && usedFields.indexOf(field) === -1) {
            usedFields.push(field)
          }
          continue
        }
        const displayName = global.profileFieldMap[field]
        if (membership[displayName] && usedFields.indexOf(field) === -1) {
          usedFields.push(field)
        }
      }
    }
    for (const field of removeFields) {
      if (usedFields.indexOf(field) === -1) {
        removeElements.push(field)
      }
    }
    dashboard.HTML.renderTable(doc, req.data.memberships, 'membership-row', 'memberships-table')
    for (const membership of req.data.memberships) {
      for (const field of removeFields) {
        if (usedFields.indexOf(field) === -1) {
          removeElements.push(`${field}-${membership.membershipid}`)
        }
      }
    }
    if (req.data.total <= global.pageSize) {
      removeElements.push('page-links')
    } else {
      dashboard.HTML.renderPagination(doc, req.data.offset, req.data.total)
    }
    removeElements.push('no-memberships')
  } else {
    removeElements.push('memberships-table')
  }
  for (const id of removeElements) {
    const element = doc.getElementById(id)
    if (element) {
      element.parentNode.removeChild(element)
    }
  }
  return dashboard.Response.end(req, res, doc)
}
