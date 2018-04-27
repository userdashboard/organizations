const API = require('../../../api/index.js')
const dashboard = require('@userappstore/dashboard')
const Navigation = require('./navbar.js')
const Organization = require('../../../../organization.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organizationid')
  }
  const organization = await Organization.load(req.query.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.data = {organization}
  if (req.session.organizationUpdateRequested && req.session.unlocked >= dashboard.Timestamp.now) {
    await API.user.organizations.UpdateOrganization.patch(req)
    req.success = true
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const email = req.body ? req.body.email || '' : req.data.organization.email
  const nameField = doc.getElementById('name')
  nameField.setAttribute('value', req.body ? req.body.name || '' : req.data.organization.name)
  const emailField = doc.getElementById('email')
  emailField.setAttribute('value', email)
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await API.user.organizations.UpdateOrganization.patch(req)
    if (req.session.unlocked) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    switch (error.message) {
      case 'invalid-organization-field':
      case 'invalid-organization-field-length':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
