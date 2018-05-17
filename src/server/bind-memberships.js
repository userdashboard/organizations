module.exports = {
  after: async (req) => {
    const memberships = await global.dashboard.organizations.Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      return
    }
    req.memberships = memberships
  }
}
