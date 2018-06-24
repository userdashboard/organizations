const dashboard = require('@userappstore/dashboard')
const orgs = require('../../index.js')

module.exports = {
  after: async (req) => {
    const organizationids = await dashboard.RedisList.listAll(`account:organizations:${req.account.accountid}`)
    if (!organizationids || !organizationids.length) {
      return
    }
    const organizations = await orgs.Organization.loadMany(organizationids)
    req.organizations = organizations
  }
}
