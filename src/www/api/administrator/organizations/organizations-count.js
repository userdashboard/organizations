const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    let index
    if (req.query) {
      if (req.query.accountid) {
        index = `${req.appid}/account/organizations/${req.query.accountid}`
      }
    }
    index = index || `${req.appid}/organizations`
    return organizations.StorageList.count(index)
  }
}
