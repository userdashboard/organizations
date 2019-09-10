const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.user.Account.get(req)
    if (!account) {
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
      const organization = await global.api.user.organizations.Organization.get(req)
      items.push(organization)
    }
    return items
  }
}
