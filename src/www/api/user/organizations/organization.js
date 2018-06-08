const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid) {
      let member = await orgs.Membership.isMember(req.query.organizationid, req.account.accountid)
      if (!member) {
        throw new Error('invalid-account')
      }
    }
    delete (organization.code)
    return organization
  }
}
