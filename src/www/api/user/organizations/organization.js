const organizations = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    let organization = await organizations.Storage.read(`${req.appid}/organization/${req.query.organizationid}`)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    organization = JSON.parse(organization)
    if (organization.object !== 'organization') {
      throw new Error('invalid-organizationid')
    }
    if (organization.ownerid !== req.account.accountid) {
      const membershipid = await organizations.Storage.read(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.query.organizationid}`)
      if (!membershipid) {
        throw new Error('invalid-account')
      }
    }
    return organization
  }
}
