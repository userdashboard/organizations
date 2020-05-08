const organizations = require('../../../../../index.js')

module.exports = {
  delete: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    await organizations.Storage.delete(`${req.appid}/organization/${req.query.organizationid}`)
    await organizations.StorageList.remove(`${req.appid}/organizations`, req.query.organizationid)
    await organizations.StorageList.remove(`${req.appid}/account/organizations/${req.account.accountid}`, req.query.organizationid)
    return true
  }
}
