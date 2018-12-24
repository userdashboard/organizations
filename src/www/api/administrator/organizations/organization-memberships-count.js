const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    return dashboard.StorageList.count(`${req.appid}/organization/memberships/${req.query.organizationid}`)
  }
}
