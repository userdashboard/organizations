const dashboard = require('@userappstore/dashboard')

module.exports = {
  delete: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization._get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    await dashboard.Storage.deleteFile(`${req.appid}/organization/${req.query.organizationid}`)
    await dashboard.StorageList.remove(`${req.appid}/organizations`, req.query.organizationid)
    await dashboard.StorageList.remove(`${req.appid}/account/organizations/${req.account.accountid}`, req.query.organizationid)
    req.success = true
  }
}
