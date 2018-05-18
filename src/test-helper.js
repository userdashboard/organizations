const dashboard = require('@userappstore/dashboard')
const path = require('path')

/* eslint-env mocha */
module.exports = dashboard.loadTestHelper()
module.exports.createInvitation = createInvitation
module.exports.createMembership = createMembership
module.exports.createOrganization = createOrganization

global.rootPath = path.join(__dirname, 'www')
dashboard.setup()
global.organizations = require('../index.js')

async function createOrganization (existingUser) {
  const user = existingUser || await module.exports.createUser()
  const name = 'organization-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  user.organization = await global.organizations.Organization.create(user.account.accountid, name)
  return user
}

async function createInvitation (existingUser, organizationid) {
  const user = existingUser || await module.exports.createUser()
  const code = 'invitation-' + new Date().getTime() + '-' + Math.ceil(Math.random() * 1000)
  const codeHash = global.dashboard.Hash.fixedSaltHash(code)
  user.invitation = await global.organizations.Invitation.create(organizationid, codeHash)
  user.invitation.code = code
  return user
}

async function createMembership (existingUser, organizationid) {
  const user = existingUser || await module.exports.createUser()
  user.membership = await global.organizations.Membership.create(organizationid, user.account.accountid)
  return user
}

beforeEach(async () => {
  global.MINIMUM_ORGANIZATION_NAME_LENGTH = 1
  global.MAXIMUM_ORGANIZATION_NAME_LENGTH = 100
  global.MINIMUM_INVITATION_CODE_LENGTH = 1
  global.MAXIMUM_INVITATION_CODE_LENGTH = 100
  global.ORGANIZATION_FIELDS = [ 'name', 'email' ]
  global.MEMBERSHIP_FIELDS = [ 'name', 'email' ]
  global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 100
  global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH = 100
})
