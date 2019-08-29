/* eslint-env mocha */
global.applicationPath = global.applicationPath || __dirname
const TestHelper = require('@userdashboard/dashboard/test-helper.js')

module.exports = {
  acceptInvitation,
  createInvitation,
  createOrganization
}

for (const x in TestHelper) {
  module.exports[x] = TestHelper[x]
}

beforeEach((callback) => {
  global.userProfileFields = ['full-name', 'contact-email']
  global.membershipProfileFields = ['display-name', 'display-email']
  global.minimumOrganizationNameLength = 1
  global.maximumOrganizationNameLength = 100
  global.minimumMembershipNameLength = 1
  global.maximumMembershipNameLength = 100
  global.minimumInvitationCodeLength = 1
  global.maximumInvitationCodeLength = 100
  return callback()
})

async function createOrganization (user, organization) {
  const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${user.account.accountid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = {
    name: organization.name,
    email: organization.email,
    profileid: user.profile.profileid
  }
  user.organization = await req.post()
  const req2 = TestHelper.createRequest(`/api/user/organizations/organization-membership?organizationid=${user.organization.organizationid}`, 'POST')
  req2.account = user.account
  req2.session = user.session
  req2.body = {
    name: organization.name,
    email: organization.email
  }
  user.membership = await req2.get()
  return user.organization
}

async function createInvitation (owner) {
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
  req.account = owner.account
  req.session = owner.session
  req.body = { code }
  owner.invitation = await req.post()
  owner.invitation.code = code
  return owner.invitation
}

async function acceptInvitation (user, owner) {
  const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = {
    code: owner.invitation.code,
    profileid: user.profile.profileid
  }
  user.membership = await req.post()
  return user.membership
}
