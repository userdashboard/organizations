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
    const memberships = await Membership.list(req.query.organizationid)
    if (memberships && memberships.length && organization.ownerid !== req.account.accountid) {
      let isMember = false
      for (const membership of memberships) {
        isMember = membership.accountid === req.account.accountid
        if (isMember) {
          break
        }
      }
      if (!isMember) {
        throw new Error('invalid-membership')
      }
    }
    if (!memberships || !memberships.length) {
      return null
    }
    return memberships
  }
}
