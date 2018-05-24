const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid) {
      const memberships = await Membership.list(req.query.organizationid)
      let isMember = false
      if (memberships && memberships.length) {
        for (const membership of memberships) {
          isMember = membership.accountid === req.account.accountid
          if (isMember) {
            break
          }
        }
      }
      if (!isMember) {
        throw new Error('invalid-account')
      }
    }
    delete (organization.code)
    return organization
  }
}
