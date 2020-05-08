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
    return organization
  }
}
