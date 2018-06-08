const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await orgs.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    delete (membership.code)
    return membership
  }
}
