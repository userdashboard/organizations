const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    let membership = await organizations.Storage.read(`${req.appid}/membership/${req.query.membershipid}`)
    if (!membership) {
      throw new Error('invalid-membershipid')
    }
    membership = JSON.parse(membership)
    if (membership.object !== 'membership') {
      throw new Error('invalid-membershipid')
    }
    if (membership.accountid !== req.account.accountid) {
      req.query.organizationid = membership.organizationid
      const organization = await global.api.user.organizations.Organization.get(req)
      if (!organization) {
        throw new Error('invalid-membershipid')
      }
      if (organization.ownerid !== req.account.accountid) {
        const member = await organizations.Storage.exists(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
        if (!member) {
          throw new Error('invalid-account')
        }
      }
    }
    req.query.profileid = membership.profileid
    req.storage = organizations
    const profile = await global.api.administrator.Profile.get(req)
    const requireProfileFields = global.membershipProfileFields
    for (const field of requireProfileFields) {
      if (field === 'full-name') {
        membership.firstName = profile.firstName
        membership.lastName = profile.lastName
      } else {
        const displayName = global.profileFieldMap[field]
        membership[displayName] = profile[displayName]
      }
    }
    return membership
  }
}
