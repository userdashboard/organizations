const dashboard = require('@userappstore/dashboard')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    if (!req.body || !req.body.name || !req.body.name.length) {
      throw new Error('invalid-organization-name')
    }
    if (global.minimumOrganizationNameLength > req.body.name.length ||
      global.maximumOrganizationNameLength < req.body.name.length) {
      throw new Error('invalid-organization-name-length')
    }
    if (!req.body.email || !req.body.email.length) {
      throw new Error('invalid-organization-email')
    }
  },
  post: async (req) => {
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
    let profile
    if (req.account.profileid) {
      req.query.profileid = req.account.profileid
      profile = await global.api.user.Profile.get(req)
    }
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: `membership`,
      membershipid: membershipid,
      organizationid: organizationid,
      accountid: req.query.accountid,
      created: dashboard.Timestamp.now,
      name: 'owner',
      email: req.body.email,
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
