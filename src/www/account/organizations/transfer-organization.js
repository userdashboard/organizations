const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  if (req.session.lockURL === req.url && req.session.unlocked) {
    try {
      await global.api.user.organizations.SetOrganizationOwner.patch(req)
    } catch (error) {
      req.error = error.message
    }
  }
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (!req.success && organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  organization.createdFormatted = dashboard.Timestamp.date(organization.created)
  req.data = { organization }
  if (req.success) {
    return
  }
  req.query.offset = 0
  let memberships = []
  let total = await global.api.user.organizations.OrganizationMembershipsCount.get(req)
  while (total > 0) {
    const more = await global.api.user.organizations.OrganizationMemberships.get(req)
    req.query.offset += global.pageSize

    total -= global.pageSize
    if (more && more.length) {
      memberships = memberships.concat(more)
    }
  }
  req.data.memberships = memberships
}

async function renderPage (req, res, messageTemplate) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  if (req.success) {
    if (req.query && req.query.returnURL) {
      return dashboard.Response.redirect(req, res, req.query.returnURL)
    }
    messageTemplate = 'success'
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.data.memberships && req.data.memberships.length) {
    dashboard.HTML.renderList(doc, req.data.memberships, 'membership-option-template', 'accountid')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.accountid || !req.body.accountid.length) {
    return renderPage(req, res, 'invalid-accountid')
  }
  try {
    await global.api.user.organizations.SetOrganizationOwner.patch(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
