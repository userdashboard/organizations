const Membership = require('../../../../membership.js')
const Organization = require('../../../../organization.js')

module.exports = {
  get: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    if (organization.ownerid !== req.account.accountid) {
      const memberships = await Membership.list(req.query.organizationid)
      if (memberships && memberships.length) {
        let isMember = false
        for (const membership of memberships) {
          isMember = membership.accountid === req.accountid
          if (isMember) {
            break
          }
        }
        if (!isMember) {
          throw new Error('invalid-organization')
        }
      }
    }
    delete (organization.code)
    return organization
  }
}
