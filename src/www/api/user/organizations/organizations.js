module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid || req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-accountid')
    }
    const organizations = await global.dashboard.organizations.Organization.list(req.query.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    return organizations
  }
}
