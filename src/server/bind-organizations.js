const Organization = require('../../index.js').Organization

module.exports = {
  after: async (req) => {
    const organizations = await Organization.list(req.account.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    req.organizations = organizations
  }
}
