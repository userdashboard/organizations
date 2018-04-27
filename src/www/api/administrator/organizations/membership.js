const Membership = require('../../../../membership.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account || !req.account.administrator) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    delete (membership.code)
    return membership
  }
}
