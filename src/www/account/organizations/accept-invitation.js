const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: renderPage,
  post: submitForm
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    if (req.query && req.query.returnURL && req.query.returnURL.indexOf('/') === 0) {
      return dashboard.Response.redirect(req, res, decodeURI(req.query.returnURL))
    }
    return dashboard.Response.redirect(req, res, `/account/organizations/membership?membershipid=${req.data.membership.membershipid}`)
  } else if (req.error) {
    messageTemplate = req.error
  }
  const doc = dashboard.HTML.parse(req.route.html)
  const submitForm = doc.getElementById('submit-form')
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success' || messageTemplate === 'invalid-account') {
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (!messageTemplate && req.method === 'GET' && req.query && req.query.returnURL) {
    const divider = submitForm.attr.action.indexOf('?') > -1 ? '&' : '?'
    submitForm.attr.action += `${divider}returnURL=${encodeURI(req.query.returnURL).split('?').join('%3F')}`
  }
  if (req.body) {
    const idField = doc.getElementById('invitationid')
    idField.setAttribute('value', req.body.invitationid || '')
    const nameField = doc.getElementById('name')
    nameField.setAttribute('value', req.body.name || '')
    const emailField = doc.getElementById('email')
    emailField.setAttribute('value', req.body.email || '')
    const codeField = doc.getElementById('code')
    codeField.setAttribute('value', req.body.code || '')
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
  if (!req.body.invitationid || !req.body.invitationid.length) {
    return renderPage(req, res, 'invalid-invitationid')
  }
  req.query = req.query || {}
  req.query.invitationid = req.body.invitationid
  try {
    const invitation = await global.api.user.organizations.OpenInvitation._get(req)
    if (invitation.accepted) {
      return renderPage(req, res, 'invalid-invitation')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.user.organizations.OpenInvitationOrganization._get(req)
    // prevent organization owner
    if (req.account.accountid === organization.ownerid) {
      return renderPage(req, res, 'invalid-account')
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
        return renderPage(req, res, 'invalid-account')
      }
    }
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  try {
    const membership = await global.api.user.organizations.CreateMembership._post(req)
    if (req.success) {
      req.data = { membership }
      return renderPage(req, res, 'success')
    }
    return renderPage(req, res, 'unknown-error')
  } catch (error) {
    return renderPage(req, res, error.message)
  }
}
