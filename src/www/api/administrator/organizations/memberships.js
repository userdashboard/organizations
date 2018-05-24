const Membership = require('../../../../membership.js')

module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.organizationid ? req.query.organizationid : null
    const memberships = await Membership.listAll(filter)
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
