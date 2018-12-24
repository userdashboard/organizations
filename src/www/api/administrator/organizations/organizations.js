const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    if (req.query.all) {
      organizationids = await dashboard.StorageList.listAll(`${req.appid}/organizations`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      organizationids = await dashboard.StorageList.list(`${req.appid}/organizations`, offset)
    }
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
