module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.organizations.Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    delete (organization.code)
    return organization
  }
}
