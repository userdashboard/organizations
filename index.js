if (!process.env.MEMBERSHIP_PROFILE_FIELDS) {
  global.membershipProfileFields = ['display-name', 'display-email']
} else {
  global.membershipProfileFields = process.env.MEMBERSHIP_PROFILE_FIELDS.split(',')
}
global.minimumOrganizationNameLength = parseInt(process.env.MINIMUM_ORGANIZATION_NAME_LENGTH || '10', 1)
global.maximumOrganizationNameLength = parseInt(process.env.MAXIMUM_ORGANIZATION_NAME_LENGTH || '10', 100)
global.minimumInvitationCodeLength = parseInt(process.env.MINIMUM_INVITATION_CODE_LENGTH || '10', 1)
global.maximumInvitationCodeLength = parseInt(process.env.MAXIMUM_INVITATION_CODE_LENGTH || '10', 100)

module.exports = {}

if (process.env.ORGANIZATIONS_STORAGE) {
  module.exports.Storage = dashboard.Storage
  module.exports.StorageObject = dashboard.StorageObject
  module.exports.StorageList = dashboard.StorageList
} else {
  module.exports.Storage = dashboard.Storage
  module.exports.StorageObject = dashboard.StorageObject
  module.exports.StorageList = dashboard.StorageList
}