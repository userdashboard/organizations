const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await global.api.user.organizations.Organization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    const membershipid = await organizations.Storage.read(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
    if (!membershipid || !membershipid.length) {
      throw new Error('invalid-account')
    }
    let membership = await organizations.Storage.read(`${req.appid}/membership/${membershipid}`)
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
