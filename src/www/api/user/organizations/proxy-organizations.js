module.exports = {
  get: async (req) => {
    const organizations = await global.dashboard.organizations.Organization.list(req.account.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    req.headers['x-organizations'] = JSON.stringify(organizations)
  }
}
