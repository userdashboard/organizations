const Membership = require('../../../../membership.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account || !req.account.administrator) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    const filter = req.query && req.query.organizationid ? req.query.organizationid : null
    const memberships = await Membership.listAll(filter)
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
