const dashboard = require('@userappstore/dashboard')
const organizations = require('../index.js')
const path = require('path')

/* eslint-env mocha */
module.exports = dashboard.loadTestHelper()
module.exports.createInvitation = createInvitation
module.exports.createMembership = createMembership
module.exports.createOrganization = createOrganization
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
})

async function createOrganization (user) {
  const name = 'organization-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  user.organization = await organizations.Organization.create(user.account.accountid, name)
  return user
}

async function createInvitation (user, organizationid) {
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const codeHash = dashboard.Hash.fixedSaltHash(code)
  user.invitation = await organizations.Invitation.create(organizationid, codeHash)
  user.invitation.code = code
  return user
}

async function createMembership (user, organizationid) {
  user.membership = await organizations.Membership.create(organizationid, user.account.accountid)
  return user
}
