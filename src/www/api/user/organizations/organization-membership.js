const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    let organization = await dashboard.Storage.read(`${req.appid}/${req.query.organizationid}`)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    organization = JSON.parse(organization)
    if (organization.object !== 'organization') {
      throw new Error('invalid-organizationid')
    }
    let membershipid = await dashboard.Storage.read(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
    if (!membershipid || !membershipid.length) {
      throw new Error('invalid-organization')
    }
    let membership = await dashboard.Storage.read(`${req.appid}/${membershipid}`)
    if (!membership) {
      throw new Error('invalid-membershipid')
    }
    membership = JSON.parse(membership)
    if (membership.object !== 'membership') {
      throw new Error('invalid-membershipid')
    }
    return membership
  }
}
