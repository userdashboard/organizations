const dashboard = require('@userdashboard/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    if (req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-account')
    }
    let organizationids
    if (req.query.all) {
      organizationids = await dashboard.StorageList.listAll(`${req.appid}/account/organizations/${req.query.accountid}`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      organizationids = await dashboard.StorageList.list(`${req.appid}/account/organizations/${req.query.accountid}`, offset)
    }
    if (!organizationids || !organizationids.length) {
      return null
    }
    const items = []
    for (const organizationid of organizationids) {
      req.query.organizationid = organizationid
      const organization = await global.api.user.organizations.Organization._get(req)
      items.push(organization)
    }
    return items
  }
}
