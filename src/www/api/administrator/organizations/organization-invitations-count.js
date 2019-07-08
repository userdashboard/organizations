const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    return dashboard.StorageList.count(`${req.appid}/organization/invitations/${req.query.organizationid}`)
  }
}
