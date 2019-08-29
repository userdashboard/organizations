const dashboard = require('@userdashboard/dashboard')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    if (!req.body || !req.body.name || !req.body.name.length) {
      throw new Error('invalid-organization-name')
    }
    if (!req.body.profileid || !req.body.profileid.length) {
      throw new Error('invalid-profileid')
    }
    req.query.profileid = req.body.profileid
    const profile = await global.api.user.Profile.get(req)
    if (!profile) {
      throw new Error('invalid-profileid')
    }
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
      if (!profile[displayName]) {
        throw new Error(`invalid-profile`)
      }
    }
    if (global.minimumOrganizationNameLength > req.body.name.length ||
      global.maximumOrganizationNameLength < req.body.name.length) {
      throw new Error('invalid-organization-name-length')
    }
    if (!req.body.email || !req.body.email.length) {
      throw new Error('invalid-organization-email')
    }
    const organizationid = `organization_${await dashboard.UUID.generateID()}`
    const organizationInfo = {
      object: `organization`,
      ownerid: req.query.accountid,
      organizationid: organizationid,
      name: req.body.name,
      email: req.body.email,
      created: dashboard.Timestamp.now
    }
    await dashboard.Storage.write(`${req.appid}/organization/${organizationid}`, organizationInfo)
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: `membership`,
      membershipid: membershipid,
      organizationid: organizationid,
      accountid: req.query.accountid,
      created: dashboard.Timestamp.now,
      profileid: req.body.profileid
    }
    await dashboard.Storage.write(`${req.appid}/membership/${membershipid}`, membershipInfo)
    await dashboard.StorageList.add(`${req.appid}/organizations`, organizationid)
    await dashboard.StorageList.add(`${req.appid}/account/organizations/${req.query.accountid}`, organizationid)
    await dashboard.StorageList.add(`${req.appid}/memberships`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/account/memberships/${req.query.accountid}`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/organization/memberships/${organizationid}`, membershipid)
    await dashboard.Storage.write(`${req.appid}/map/organizationid/membershipid/${req.query.accountid}/${organizationid}`, membershipid)
    req.success = true
    return organizationInfo
  }
}
