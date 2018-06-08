const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.accountid ? req.query.accountid : null
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const organizations = await orgs.Organization.listAll(filter, offset)
    if (!organizations || !organizations.length) {
      return null
    }
    return organizations
  }
}
