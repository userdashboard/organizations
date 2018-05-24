const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid || req.query.accountid !== req.account.accountid) {
      throw new Error('invalid-accountid')
    }
    const organizations = await Organization.list(req.query.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    return organizations
  }
}
