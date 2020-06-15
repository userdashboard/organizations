const dashboard = require('@userdashboard/dashboard')
const organizations = require('../../../../../index.js')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.user.Account.get(req)
    if (!account) {
      throw new Error('invalid-account')
    }
    if (!req.body || !req.body.name || !req.body.name.length) {
      throw new Error('invalid-organization-name')
    }
    if (!req.body.profileid || !req.body.profileid.length) {
      throw new Error('invalid-profileid')
    }
    req.query.profileid = req.body.profileid
    req.storage = organizations
    const profile = await global.api.user.Profile.get(req)
    if (!profile) {
      throw new Error('invalid-profileid')
    }
    const requireProfileFields = global.membershipProfileFields
    for (const field of requireProfileFields) {
      if (field === 'full-name') {
        if (!profile.firstName || !profile.lastName) {
          throw new Error('invalid-profile')
        }
        continue
      }
      const displayName = global.profileFieldMap[field]
      if (!profile[displayName]) {
        throw new Error('invalid-profile')
      }
    }
    if (global.minimumOrganizationNameLength > req.body.name.length ||
      global.maximumOrganizationNameLength < req.body.name.length) {
      throw new Error('invalid-organization-name-length')
    }
    if (!req.body.email || !req.body.email.length || req.body.email.indexOf('@') < 1) {
      throw new Error('invalid-organization-email')
    }
    const organizationid = `organization_${await dashboard.UUID.generateID()}`
    const organizationInfo = {
      object: 'organization',
      ownerid: req.query.accountid,
      organizationid: organizationid,
      name: req.body.name,
      email: req.body.email,
      created: dashboard.Timestamp.now
    }
    await organizations.Storage.write(`${req.appid}/organization/${organizationid}`, organizationInfo)
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: 'membership',
      membershipid: membershipid,
      organizationid: organizationid,
      accountid: req.query.accountid,
      created: dashboard.Timestamp.now,
      profileid: req.body.profileid
    }
    await organizations.Storage.write(`${req.appid}/membership/${membershipid}`, membershipInfo)
    await organizations.StorageList.addMany({
      [`${req.appid}/organizations`]: organizationid,
      [`${req.appid}/account/organizations/${req.query.accountid}`]: organizationid,
      [`${req.appid}/memberships`]: membershipid,
      [`${req.appid}/account/memberships/${req.query.accountid}`]: membershipid,
      [`${req.appid}/organization/memberships/${organizationid}`]: membershipid
    })
    await organizations.Storage.write(`${req.appid}/map/organizationid/membershipid/${req.query.accountid}/${organizationid}`, membershipid)
    return organizationInfo
  }
}
