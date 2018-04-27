const API = require('../../api/index.js')
const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../membership.js')
const Navigation = require('./navbar.js')
const Organization = require('../../../organization.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await Membership.load(req.query.membershipid)
  if (!membership) {
    throw new Error('invalid-membership')
  }
  if (membership.accountid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  const organization = await Organization.load(membership.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  req.data = {organization, membership}
  if (req.session.membershipUpdateRequested && req.session.unlocked >= dashboard.Timestamp.now) {
    await API.user.organizations.UpdateMembership.patch(req)
    req.success = true
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const userEmail = req.body ? req.body.email || '' : req.data.membership.email
  const nameField = doc.getElementById('organizationName')
  nameField.setAttribute('value', req.data.organization.name)
  const emailField = doc.getElementById('email')
  emailField.setAttribute('value', userEmail)
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await API.user.organizations.UpdateMembership.patch(req)
    if (req.session.unlocked) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    switch (error.message) {
      case 'invalid-membership-field':
      case 'invalid-membership-field-length':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
