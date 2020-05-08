const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    let index
    if (req.query) {
      if (req.query.accountid) {
        index = `${req.appid}/account/memberships/${req.query.accountid}`
      } else if (req.query.organizationid) {
        index = `${req.appid}/organization/memberships/${req.query.organizationid}`
      }
    }
    index = index || `${req.appid}/memberships`
    return organizations.StorageList.count(index)
  }
}
