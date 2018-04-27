const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
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
