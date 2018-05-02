const API = require('../../api/index.js')
const dashboard = require('@userappstore/dashboard')
const Invitation = require('../../../invitation.js')
const Membership = require('../../../membership.js')
const Navigation = require('./navbar.js')
const Organization = require('../../../organization.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitation')
  }
  const invitation = await Invitation.load(req.query.invitationid)
  if (!invitation || (invitation.accepted && invitation.accepted !== req.account.accountid)) {
    throw new Error('invalid-invitation')
  }
  const organization = await Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (req.account.accountid === organization.ownerid) {
    req.error = 'invalid-account'
    return
  }
  const unique = await Membership.isUniqueMembership(invitation.organizationid, req.account.accountid)
  if (!unique) {
    throw new Error('invalid-account')
  }
  req.data = { organization }
  if (req.session.membershipRequested && req.session.unlocked >= dashboard.Timestamp.now) {
    const membership = await API.user.organizations.AcceptInvitation.patch(req)
    if (membership && membership.membershipid) {
      req.success = true
      req.data.membership = membership
    }
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  } else if (req.error === 'invalid-account') {
    messageTemplate = 'invalid-account'
  }
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const submitForm = doc.getElementById('submitForm')
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.remove()
      return dashboard.Response.end(req, res, doc)
    }
  }
  submitForm.setAttribute('action', req.url)
  const nameField = doc.getElementById('organizationName')
  nameField.setAttribute('value', req.data.organization.name)
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  try {
    await API.user.organizations.AcceptInvitation.patch(req)
    if (req.session.unlocked) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    switch (error.message) {
      case 'invalid-invitation-code':
      case 'invalid-invitation-code-length':
      case 'invalid-accountid':
        return renderPage(req, res, error.message)
    }
    return renderPage(req, res, 'unknown-error')
  }
}
