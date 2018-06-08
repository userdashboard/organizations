const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const count = await orgs.Invitation.countAll()
    return count
  }
}
