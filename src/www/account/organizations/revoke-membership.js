const dashboard = require('@userdashboard/dashboard')
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
  if (req.query.message === 'success') {
    req.data = {
      membership: {
        membershipid: req.query.membershipid
      },
      organization: {
        organizationid: req.query.organizationid
      }
    }
    return
  }
  const membership = await global.api.user.organizations.Membership.get(req)
  if (!membership) {
    throw new Error('invalid-membership')
  }
  req.query.organizationid = membership.organizationid
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  membership.createdFormatted = dashboard.Format.date(membership.created)
  req.data = { organization, membership }
}

async function renderPage (req, res, messageTemplate) {
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.membership, 'membership', req.language)
  await navbar.setup(doc, req.data.organization, req.account)
  const organizationName = doc.getElementById('organizationName')
  organizationName.setAttribute('value', req.data.organization.name)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  try {
    await global.api.user.organizations.DeleteMembership.delete(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?membershipid=${req.query.membershipid}&organizationid=${req.query.organizationid}&message=success`
    })
    return res.end()
  }
}
