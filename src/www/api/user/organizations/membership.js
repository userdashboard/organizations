const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    let membership = await dashboard.Storage.read(`${req.appid}/membership/${req.query.membershipid}`)
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
        const member = await dashboard.Storage.exists(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
        if (!member) {
          throw new Error('invalid-account')
        }
      }
    }
    req.query.profileid = membership.profileid
    const profile = await global.api.administrator.Profile.get(req)
    const requireProfileFields = global.membershipProfileFields
    for (const field of requireProfileFields) {
      let displayName = field
      if (displayName.indexOf('-') > -1) {
        displayName = displayName.split('-')
        if (displayName.length === 1) {
          displayName = displayName[0]
        } else if (displayName.length === 2) {
          displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1)
        } else if (displayName.length === 3) {
          displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1) + displayName[2].substring(0, 1).toUpperCase() + displayName[2].substring(1)
        }
      }
      if (field === 'full-name') {
        membership.firstName = profile.firstName
        membership.lastName = profile.lastName
      } else {
        membership[displayName] = profile[displayName]
      }
    }
    return membership
  }
}
