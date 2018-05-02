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
    throw new Error('invalid-organization')
  }
  const organization = await Organization.load(req.query.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.data = { organization }
  if (req.session.newInvitationRequested && req.session.unlocked >= dashboard.Timestamp.now) {
    const invitation = await API.user.organizations.CreateInvitation.post(req)
    if (invitation && invitation.invitationid) {
      req.success = true
      req.data.invitation = invitation
    }
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  doc.getElementById('organizationName').setAttribute('value', req.data.organization.name)
  doc.getElementById('code').setAttribute('value', req.body ? req.body.code : dashboard.UUID.random(10))
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(req.data.invitation, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success') {
      submitForm.remove()
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (!req.body.code) {
    return renderPage(req, res, 'invalid-invitation-code')
  }
  try {
    await API.user.organizations.CreateInvitation.post(req)
    if (req.session.unlocked) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, 'unknown-error')
  }
}
