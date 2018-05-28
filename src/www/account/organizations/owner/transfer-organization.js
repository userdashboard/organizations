const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')

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
  const memberships = await global.api.user.organizations.Memberships.get(req)
  req.data = {organization, memberships}
  if (req.session.lockURL === req.url && req.session.unlocked >= dashboard.Timestamp.now) {
    const transferred = await global.api.user.organizations.TransferOrganization.patch(req)
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
  const doc = dashboard.HTML.parse(req.route.html)
  await dashboard.HTML.renderNavigation(doc, req.query)
  await Navigation.render(req, doc)
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success') {
      submitForm.removeElement()
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.data.memberships && req.data.memberships.length) {
    doc.renderList(req.data.memberships, 'membership-option-template', 'accountid')
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
    await global.api.user.organizations.TransferOrganization.patch(req)
    return renderPage(req, res, 'success')
  } catch (error) {
    switch (error.message) {
      case 'invalid-accountid':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
