const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const count = await orgs.Membership.countAll()
    return count
  }
}
