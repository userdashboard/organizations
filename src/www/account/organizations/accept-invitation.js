const dashboard = require('@userappstore/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.invitationid) {
    throw new Error('invalid-invitationid')
  }
  if (req.session.lockURL === req.url && req.session.unlocked) {
    try {
      await global.api.user.organizations.CreateMembership._post(req)
    } catch (error) {
      req.error = error.message
    }
  }
  if (!req.success) {
    const invitation = await global.api.user.organizations.OpenInvitation._get(req)
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
  }
  let organization
  if (req.success) {
    organization = await global.api.user.organizations.Organization._get(req)
  } else {
    organization = await global.api.user.organizations.OpenInvitationOrganization._get(req)
  }
  // prevent organization owner
  if (req.account.accountid === organization.ownerid) {
    throw new Error('invalid-account')
  }
  if (!req.success) {
    // prevent organization members
    let membership
    try {
      req.query.organizationid = organization.organizationid
      membership = await global.api.user.organizations.OrganizationMembership._get(req)
    } catch (error) {
    }
    if (membership) {
      throw new Error('invalid-account')
    }
  }
  req.data = { organization }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL) {
      return dashboard.Response.redirect(req, res, req.query.returnURL)
    }
    messageTemplate = 'success'
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html, req.data.organization, 'organization')
  const submitForm = doc.getElementById('submit-form')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.body) {
    const nameField = doc.getElementById('name')
    nameField.setAttribute('value', req.body.name || '')
    const emailField = doc.getElementById('email')
    emailField.setAttribute('value', req.body.email || '')
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
    await global.api.user.organizations.CreateMembership._post(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
