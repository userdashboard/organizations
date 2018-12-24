const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
    const organizationids = await dashboard.StorageList.list(`${req.appid}/account/organizations/${req.query.accountid}`, offset)
    if (!organizationids || !organizationids.length) {
      return null
    }
    const items = []
    for (const organizationid of organizationids) {
      req.query.organizationid = organizationid
      const organization = await global.api.administrator.organizations.Organization.get(req)
      items.push(organization)
    }
    return items
  }
}
