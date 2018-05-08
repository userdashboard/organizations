module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await global.dashboard.organizations.Membership.load(req.query.membershipid)
    if (!membership) {
      throw new Error('invalid-membership')
    }
    delete (membership.code)
    return membership
  }
}
