const dashboard = require('@userdashboard/dashboard')

module.exports = {
  before: beforeRequest,
  get: renderPage,
  post: submitForm
}

async function beforeRequest (req) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
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
  const organization = await global.api.user.organizations.Organization.get(req)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (organization.ownerid !== req.account.accountid) {
    throw new Error('invalid-account')
  }
  organization.createdFormatted = dashboard.Format.date(organization.created)
  req.data = { organization }
  req.query.offset = 0
  req.query.accountid = req.account.accountid
  req.query.all = true
  req.data.memberships = await global.api.user.organizations.Memberships.get(req)
}

async function renderPage (req, res, messageTemplate) {
  if (!req.query || !req.query.organizationid) {
    throw new Error('invalid-organization')
  }
  messageTemplate = messageTemplate || (req.query ? req.query.message : null)
  const doc = dashboard.HTML.parse(req.html || req.route.html, req.data.organization, 'organization', req.language)
  if (messageTemplate) {
    dashboard.HTML.renderTemplate(doc, null, messageTemplate, 'message-container')
    if (messageTemplate === 'success') {
      const submitForm = doc.getElementById('submit-form')
      submitForm.parentNode.removeChild(submitForm)
      return dashboard.Response.end(req, res, doc)
    }
  }
  if (req.data.memberships && req.data.memberships.length) {
    dashboard.HTML.renderList(doc, req.data.memberships, 'membership-option-template', 'accountid')
  }
  return dashboard.Response.end(req, res, doc)
}

async function submitForm (req, res) {
  if (!req.body) {
    return renderPage(req, res)
  }
  if (req.query && req.query.message === 'success') {
    return renderPage(req, res)
  }
  if (!req.body.accountid || !req.body.accountid.length) {
    return renderPage(req, res, 'invalid-accountid')
  }
  try {
    await global.api.user.organizations.SetOrganizationOwner.patch(req)
  } catch (error) {
    return renderPage(req, res, error.message)
  }
  if (req.query['return-url']) {
    return dashboard.Response.redirect(req, res, req.query['return-url'])
  } else {
    res.writeHead(302, {
      location: `${req.urlPath}?organizationid=${req.query.organizationid}&message=success`
    })
    return res.end()
  }
}
