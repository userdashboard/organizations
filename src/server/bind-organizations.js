const orgs = require('../../index.js')

module.exports = {
  after: async (req) => {
    const organizations = await orgs.Organization.list(req.account.accountid)
    if (!organizations || !organizations.length) {
      return null
    }
    req.organizations = organizations
  }
}
