module.exports = {
  after: async (req) => {
    const memberships = await global.organizations.Membership.listByAccount(req.account.accountid)
    if (!memberships || !memberships.length) {
      req.headers['x-memberships'] = ''
      return
    }
    req.headers['x-memberships'] = JSON.stringify(memberships)
  }
}
