const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.user.Account.get(req)
    if (!account) {
      throw new Error('invalid-account')
    }
    let index
    if (req.query.organizationid) {
      index = `${req.appid}/organization/memberships/${req.query.organizationid}`
      const membership = await global.api.user.organizations.OrganizationMembership.get(req)
      if (!membership) {
        throw new Error('invalid-organizationid')
      }
    } else {
      index = `${req.appid}/account/memberships/${req.query.accountid}`
    }
    let membershipids
    if (req.query.all) {
      membershipids = await organizations.StorageList.listAll(index)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      membershipids = await organizations.StorageList.list(index, offset, limit)
    }
    if (!membershipids || !membershipids.length) {
      return null
    }
    const items = []
    for (const membershipid of membershipids) {
      req.query.membershipid = membershipid
      const membership = await global.api.user.organizations.Membership.get(req)
      items.push(membership)
    }
    return items
  }
}
