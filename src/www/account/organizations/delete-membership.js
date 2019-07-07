const dashboard = require('@userappstore/dashboard')
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
  const membership = await await global.api.user.organizations.Membership._get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization._get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (membership.accountid !== req.account.accountid && organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  membership.createdFormatted = dashboard.Timestamp.date(membership.created)
  req.data = { organization, membership }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
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
  if (!messageTemplate && req.method === 'GET' && req.query && req.query.returnURL) {
    const submitForm = doc.getElementById('submit-form')
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3F')}`
  }
  await navbar.setup(doc, req)
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
    await global.api.user.organizations.DeleteMembership._delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
