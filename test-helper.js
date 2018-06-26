const dashboard = require('@userappstore/dashboard')

/* eslint-env mocha */
const TestHelper = module.exports = dashboard.loadTestHelper()
module.exports.acceptInvitation = acceptInvitation
module.exports.createInvitation = createInvitation
module.exports.createMembership = createMembership
module.exports.createOrganization = createOrganization

dashboard.setup(__dirname)
global.redisClient.select(2)

beforeEach(() => {
  global.redisClient.flushdb()
  global.MINIMUM_ORGANIZATION_NAME_LENGTH = 1
  global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 100
  global.MINIMUM_INVITATION_CODE_LENGTH = 1
  global.MAXIMUM_INVITATION_CODE_LENGTH = 100
  global.ORGANIZATION_FIELDS = [ 'name', 'email' ]
  global.MEMBERSHIP_FIELDS = [ 'name', 'email' ]
  global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 100
  global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH = 100
  global.PAGE_SIZE = 2
})

async function createOrganization (user) {
  const name = 'organization-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const req = TestHelper.createRequest(`/api/user/organizations/create-organization?accountid=${user.account.accountid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = { name }
  await req.route.api.post(req)
  req.session = await TestHelper.unlockSession(user)
  user.organization = await req.route.api.post(req)
  user.session = await dashboard.Session.load(user.session.sessionid)
  return user.organization
}

async function createInvitation (owner) {
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const req = TestHelper.createRequest(`/api/user/organizations/create-invitation?organizationid=${owner.organization.organizationid}`, 'POST')
  req.account = owner.account
  req.session = owner.session
  req.body = { code }
  await req.route.api.post(req)
  req.session = await TestHelper.unlockSession(owner)
  owner.invitation = await req.route.api.post(req)
  owner.invitation.code = code
  owner.session = await dashboard.Session.load(owner.session.sessionid)
  return owner.invitation
}

async function acceptInvitation (user, owner) {
  const req = TestHelper.createRequest(`/api/user/organizations/create-membership?invitationid=${owner.invitation.invitationid}`, 'POST')
  req.account = user.account
  req.session = user.session
  req.body = { code: owner.invitation.code }
  await req.route.api.post(req)
  req.session = await TestHelper.unlockSession(user)
  user.membership = await req.route.api.post(req)
  user.session = await dashboard.Session.load(user.session.sessionid)
  return user.membership
}

async function createMembership (user, owner) {
  await createInvitation(owner)
  return acceptInvitation(user, owner)
}
