const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.user.Account.get(req)
    if (!account) {
      throw new Error('invalid-account')
    }
    let index
    if (req.query.organizationid) {
      index = `${req.appid}/organization/invitations/${req.query.organizationid}`
      const organization = await global.api.user.organizations.Organization.get(req)
      if (!organization) {
        throw new Error('invalid-organizationid')
      }
      if (organization.ownerid !== req.account.accountid) {
        throw new Error('invalid-account')
      }
    } else {
      index = `${req.appid}/account/invitations/${req.query.accountid}`
    }
    return organizations.StorageList.count(index)
  }
}
