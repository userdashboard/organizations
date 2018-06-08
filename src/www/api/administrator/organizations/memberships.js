const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.organizationid ? req.query.organizationid : null
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const memberships = await orgs.Membership.listAll(filter, offset)
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
