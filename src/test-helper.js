const dashboard = require('@userappstore/dashboard')
const orgs = require('../index.js')
const path = require('path')

/* eslint-env mocha */
module.exports = dashboard.loadTestHelper()
module.exports.acceptInvitation = acceptInvitation
module.exports.createInvitation = createInvitation
module.exports.createMembership = createMembership
module.exports.createOrganization = createOrganization
module.exports.transferOrganization = transferOrganization

dashboard.setup(path.join(__dirname, '..'))
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
  global.PAGE_SIZE = 3
})

async function createOrganization (user) {
  const name = 'organization-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  user.organization = await orgs.Organization.create(user.account.accountid, name)
  return user.organization
}

async function createInvitation (user, organizationid) {
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const codeHash = dashboard.Hash.fixedSaltHash(code)
  user.invitation = await orgs.Invitation.create(organizationid, codeHash)
  user.invitation.code = code
  return user.invitation
}

async function acceptInvitation (user, owner) {
  user.invitation = await orgs.Invitation.accept(owner.organization.organizationid, owner.invitation.code, user.account.accountid)
  return user.invitation
}

async function createMembership (user, organizationid) {
  user.membership = await orgs.Membership.create(organizationid, user.account.accountid)
  if (user.invitation) {
    await orgs.Membership.setProperty(user.membership.membershipid, 'invitationid', user.invitation.invitationid)
    await orgs.Invitation.setProperty(user.invitation.invitationid, 'membershipid', user.membership.membershipid)
  }
  return user.membership
}

async function transferOrganization (user, organizationid) {
  await orgs.Organization.setProperty(organizationid, `ownerid`, user.account.accountid)
  user.organization = await orgs.Organization.load(organizationid)
  return user.organization
}
