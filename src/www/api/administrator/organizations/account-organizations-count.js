const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    return dashboard.StorageList.count(`${req.appid}/account/organizations/${req.query.accountid}`)
  }
}
