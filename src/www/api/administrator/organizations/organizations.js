module.exports = {
  get: async (req) => {
    const filter = req.query && req.query.accountid ? req.query.accountid : null
    const allOrganizations = await global.organizations.Organization.listAll(filter)
    if (!allOrganizations || !allOrganizations.length) {
      return null
    }
    return allOrganizations
  }
}
