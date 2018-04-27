const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account || !req.account.administrator) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    delete (organization.code)
    return organization
  }
}
