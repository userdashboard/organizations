const dashboard = require('@userappstore/dashboard')
const path = require('path')

module.exports = {
  Invitation: require('./src/invitation.js'),
  Membership: require('./src/membership.js'),
  Organization: require('./src/organization.js')
}

if (process.env.SELF_START) {
  global.MINIMUM_ORGANIZATION_NAME_LENGTH = parseInt(process.env.MINIMUM_ORGANIZATION_NAME_LENGTH || '10', 1)
  global.MAXIMUM_ORGANIZATION_NAME_LENGTH = parseInt(process.env.MAXIMUM_ORGANIZATION_NAME_LENGTH || '10', 100)
  global.MINIMUM_INVITATION_CODE_LENGTH = parseInt(process.env.MINIMUM_INVITATION_CODE_LENGTH || '10', 1)
  global.MAXIMUM_INVITATION_CODE_LENGTH = parseInt(process.env.MAXIMUM_INVITATION_CODE_LENGTH || '10', 100)
  global.ORGANIZATION_FIELDS = (process.env.ORGANIZATION_FIELDS || 'name,email').split(',')
  global.MEMBERSHIP_FIELDS = (process.env.MEMBERSHIP_FIELDS || 'name,email').split(',')
  global.MAXIMUM_ORGANIZATION_FIELD_LENGTH = 100
  global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH = 100
  global.rootPath = path.join(__dirname, 'src/www')
  dashboard.setup()
  global.dashboard.organizations = module.exports
}
