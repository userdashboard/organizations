const dashboard = require('@userdashboard/dashboard')
const navbar = require('./navbar-membership.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await await global.api.user.organizations.Membership.get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (membership.accountid !== req.account.accountid &&
      organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  membership.createdFormatted = dashboard.Format.date(membership.created)
  req.data = { organization, membership }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query['return-url']) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query['return-url']))
    }
    if (req.data.organization.ownerid === req.account.accountid) {
      return dashboard.Response.redirect(req, res, `/account/organizations/organization-memberships?organizationid=${req.data.organization.organizationid}`)
    } else {
      return dashboard.Response.redirect(req, res, '/account/organizations/memberships')
    }
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.membership, 'membership')
  await navbar.setup(doc, req.data.organization, req.account)
  const organizationName = doc.getElementById('organizationName')
  organizationName.setAttribute('value', req.data.organization.name)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteMembership.delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
