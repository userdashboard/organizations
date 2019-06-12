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
  if (req.session.lockURL === req.url && req.session.unlocked) {
    try {
      await global.api.user.organizations.UpdateMembership._patch(req)
    } catch (error) {
      req.error = error.message
    }
  }
  const membership = await global.api.user.organizations.Membership._get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  if (membership.accountid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization._get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  req.data = { organization, membership }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
    }
    messageTemplate = 'success'
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.membership, 'membership')
  if (!messageTemplate && req.method === 'GET' && req.query && req.query.returnURL) {
    const submitForm = doc.getElementById('submit-form')
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3E')}`
  }
  await navbar.setup(doc, req)
  const userEmail = req.body ? req.body.email || '' : req.data.membership.email
  const userName = req.body ? req.body.name || '' : req.data.membership.name
  const organizationField = doc.getElementById('organizationName')
  organizationField.setAttribute('value', req.data.organization.name)
  const nameField = doc.getElementById('name')
  nameField.setAttribute('value', userName)
  const emailField = doc.getElementById('email')
  emailField.setAttribute('value', userEmail)
  const submitForm = doc.getElementById('submit-form')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.name || !req.body.name.length) {
    return renderPage(req, res, 'invalid-membership-name')
  }
  if (global.minimumMembershipNameLength > req.body.name.length ||
    global.maximumMembershipNameLength < req.body.name.length) {
    return renderPage(req, res, 'invalid-membership-name-length')
  }
  if (!req.body.email || !req.body.email.length) {
    return renderPage(req, res, 'invalid-membership-email')
  }
  try {
    await global.api.user.organizations.UpdateMembership._patch(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
