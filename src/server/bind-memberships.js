module.exports = {
  after: async (req) => {
    const memberships = await global.organizations.Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      return
    }
    req.memberships = memberships
  }
}
