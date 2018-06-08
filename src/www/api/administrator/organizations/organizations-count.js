const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const count = await orgs.Organization.countAll()
    return count
  }
}
