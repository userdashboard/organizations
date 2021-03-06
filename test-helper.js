/* eslint-env mocha */
global.applicationPath = global.applicationPath || __dirname
global.testConfiguration = global.testConfiguration || {}
global.testConfiguration.userProfileFields = ['full-name', 'contact-email']
global.testConfiguration.membershipProfileFields = ['display-name', 'display-email']
global.testConfiguration.minimumOrganizationNameLength = 1
global.testConfiguration.maximumOrganizationNameLength = 100
global.testConfiguration.minimumMembershipNameLength = 1
global.testConfiguration.maximumMembershipNameLength = 100
global.testConfiguration.minimumInvitationCodeLength = 1
global.testConfiguration.maximumInvitationCodeLength = 100

const TestHelper = require('@userdashboard/dashboard/test-helper.js')
let organizations

module.exports = {
  acceptInvitation,
  createInvitation,
  createOrganization
}

for (const x in TestHelper) {
  module.exports[x] = TestHelper[x]
}

async function setupBefore () {
  organizations = require('./index.js')
  await organizations.setup()
}

module.exports.createProfile = createProfile

before(setupBefore)

async function createOrganization (user, properties) {
  const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${user.account.accountid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = properties
  user.organization = await req.post()
  const req2 = TestHelper.createRequest(`/api/user/organizations/organization-membership?organizationid=${user.organization.organizationid}`, 'POST')
  req2.account = user.account
  req2.session = user.session
  req2.body = properties
  user.membership = await req2.get()
  return user.organization
}

async function createInvitation (owner) {
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
  req.account = owner.account
  req.session = owner.session
  req.body = {
    'secret-code': code
  }
  owner.invitation = await req.post()
  owner.invitation.secretCode = code
  return owner.invitation
}

async function acceptInvitation (user, owner) {
  const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = {
    'secret-code': owner.invitation.secretCode,
    profileid: user.profile.profileid
  }
  user.membership = await req.post()
  return user.membership
}

async function createProfile (user, properties) {
  const req = module.exports.createRequest(`/api/user/create-profile?accountid=${user.account.accountid}`)
  req.account = user.account
  req.session = user.session
  if (process.env.ORGANIZATIONS_STORAGE) {
    req.storage = organizations
  }
  req.body = properties
  user.profile = await req.route.api.post(req)
  return user.profile
}
