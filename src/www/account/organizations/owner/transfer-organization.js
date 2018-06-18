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
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  const memberships = await global.api.user.organizations.OrganizationMemberships.get(req)
  req.data = {organization, memberships}
  if (req.session.lockURL === req.url && req.session.unlocked >= dashboard.Timestamp.now) {
    const transferred = await global.api.user.organizations.SetOrganizationOwner.patch(req)
    if (transferred === true) {
      req.success = true
    }
  }
}

async function renderPage (req, res, messageTemplate) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  if (req.success) {
    messageTemplate = 'success'
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
    return renderPage(req, res, 'success')
  } catch (error) {
    switch (error.message) {
      case 'invalid-accountid':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
