const dashboard = require('@userappstore/dashboard')

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
    await global.api.user.organizations.UpdateMembership.patch(req)
    if (req.success) {
      return
    }
  }
  const membership = await global.api.user.organizations.Membership.get(req)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  if (membership.accountid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  req.data = {organization, membership}
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = dashboard.HTML.parse(req.route.html)
  const userEmail = req.body ? req.body.email || '' : req.data.membership.email
  const nameField = doc.getElementById('organizationName')
  nameField.setAttribute('value', req.data.organization.name)
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
  for (const property in req.body) {
    if (global.MEMBERSHIP_FIELDS.indexOf(property) === -1) {
      return renderPage(req, res, 'invalid-membership-field')
    }
    if (global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH < req.body[property].length) {
      return renderPage(req, res, 'invalid-membership-field-length')
    }
  }
  try {
    await global.api.user.organizations.UpdateMembership.patch(req)
    if (req.success) {
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
