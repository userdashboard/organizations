const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const memberships = await orgs.Membership.listByOrganization(req.query.organizationid, offset)
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
