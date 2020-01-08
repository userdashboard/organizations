const dashboard = require('@userdashboard/dashboard')

module.exports = {
  delete: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await global.api.user.organizations.Membership.get(req)
    if (!membership) {
      throw new Error('invalid-membershipid')
    }
    req.query.organizationid = membership.organizationid
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    await dashboard.Storage.deleteFile(`${req.appid}/membership/${req.query.membershipid}`)
    await dashboard.StorageList.remove(`${req.appid}/memberships`, req.query.membershipid)
    await dashboard.StorageList.remove(`${req.appid}/account/memberships/${membership.accountid}`, req.query.membershipid)
    await dashboard.StorageList.remove(`${req.appid}/organization/memberships/${organization.organizationid}`, req.query.membershipid)
    await dashboard.Storage.deleteFile(`${req.appid}/map/organizationid/membershipid/${membership.accountid}/${req.query.organizationid}`)
        return true
  }
}
