const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage
}

async function beforeRequest (req) {
  req.query = req.query || {}
  req.query.accountid = req.account.accountid
  const total = await global.api.user.organizations.MembershipsCount.get(req)
  const memberships = await global.api.user.organizations.Memberships.get(req)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      membership.createdFormatted = dashboard.Format.date(membership.created)
    }
  }
  const offset = req.query ? req.query.offset || 0 : 0
  req.data = { memberships, total, offset }
}

async function renderPage (req, res) {
  const doc = dashboard.HTML.parse(req.route.html)
  const removeElements = []
  if (req.data.memberships && req.data.memberships.length) {
    const removeFields = [].concat(global.profileFields)
    const usedFields = []
    for (const membership of req.data.memberships) {
      for (const field of removeFields) {
        if (usedFields.indexOf(field) > -1) {
          continue
        }
        let displayName = field
        if (displayName.indexOf('-') > -1) {
          displayName = displayName.split('-')
          if (displayName.length === 1) {
            displayName = displayName[0]
          } else if (displayName.length === 2) {
            displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1)
          } else if (displayName.length === 3) {
            displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1) + displayName[2].substring(0, 1).toUpperCase() + displayName[2].substring(1)
          }
        }
        if (displayName === 'fullName') {
          if (membership.firstName && usedFields.indexOf(field) === -1) {
            usedFields.push(field)
          }
          continue
        }
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
    element.parentNode.removeChild(element)
  }
  return dashboard.Response.end(req, res, doc)
}
