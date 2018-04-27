const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account || !req.account.administrator) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    const filter = req.query && req.query.accountid ? req.query.accountid : null
    const organizations = await Organization.listAll(filter)
    if (!organizations || !organizations.length) {
      return null
    }
    return organizations
  }
}
