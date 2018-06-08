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
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (organization.ownerid === req.account.accountid) {
      return memberships
    }
    for (const membership of memberships) {
      if (membership.accountid === req.account.accountid) {
        return memberships
      }
    }
    throw new Error('invalid-account')
  }
}
