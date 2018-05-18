const Navigation = require('./navbar.js')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.membershipid) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.organizations.Membership.load(req.query.membershipid)
  if (!membership) {
    throw new Error('invalid-membership')
  }
  if (membership.accountid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  const organization = await global.organizations.Organization.load(membership.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  req.data = {organization, membership}
  if (req.session.lockURL === req.url && req.session.unlocked >= global.dashboard.Timestamp.now) {
    await global.api.user.organizations.DeleteMembership.delete(req)
  }
}

async function renderPage (req, res, messageTemplate) {
  if (req.success) {
    messageTemplate = 'success'
  }
  const doc = global.dashboard.HTML.parse(req.route.html)
  await Navigation.render(req, doc)
  const organizationName = doc.getElementById('organizationName')
  organizationName.setAttribute('value', req.data.organization.name)
  const submitForm = doc.getElementById('submitForm')
  submitForm.setAttribute('action', req.url)
  if (messageTemplate) {
    doc.renderTemplate(null, messageTemplate, 'messageContainer')
    if (messageTemplate === 'success') {
      submitForm.remove()
      return global.dashboard.Response.end(req, res, doc)
    }
  }
  return global.dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteMembership.delete(req)
    if (req.success) {
      return renderPage(req, res, 'success')
    }
    return global.dashboard.Response.redirect(req, res, '/account/authorize')
  } catch (error) {
    return renderPage(req, res, 'unknown-error')
  }
}
