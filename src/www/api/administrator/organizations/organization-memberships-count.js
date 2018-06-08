const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const count = await orgs.Membership.countByOrganization(req.query.organizationid)
    return count
  }
}
