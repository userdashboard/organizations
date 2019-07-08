const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization._get(req)
    if (!organization || organization.ownerid !== req.account.accountid) {
      const member = await dashboard.Storage.exists(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
      if (!member) {
        throw new Error('invalid-organization')
      }
    }
    return dashboard.StorageList.count(`${req.appid}/organization/memberships/${req.query.organizationid}`)
  }
}
