global.minimumOrganizationNameLength = parseInt(process.env.MINIMUM_ORGANIZATION_NAME_LENGTH || '10', 1)
global.maximumOrganizationNameLength = parseInt(process.env.MAXIMUM_ORGANIZATION_NAME_LENGTH || '10', 100)
global.minimumInvitationCodeLength = parseInt(process.env.MINIMUM_INVITATION_CODE_LENGTH || '10', 1)
global.maximumInvitationCodeLength = parseInt(process.env.MAXIMUM_INVITATION_CODE_LENGTH || '10', 100)

module.exports = {}
