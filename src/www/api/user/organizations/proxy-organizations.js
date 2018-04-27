const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    const organizations = await Organization.list(req.account.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    req.headers['x-organizations'] = JSON.stringify(organizations)
  }
}
