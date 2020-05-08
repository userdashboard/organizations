const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    let index
    if (req.query) {
      if (req.query.accountid) {
        index = `${req.appid}/account/invitations/${req.query.accountid}`
      } else if (req.query.organizationid) {
        index = `${req.appid}/organization/invitations/${req.query.organizationid}`
      }
    }
    index = index || `${req.appid}/invitations`
    return organizations.StorageList.count(index)
  }
}
