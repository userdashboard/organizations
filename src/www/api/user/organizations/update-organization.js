const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    if (!req.body) {
      throw new Error('invalid-organization-field')
    }
    for (const property in req.body) {
      if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
        throw new Error('invalid-organization-field')
      }
      if (global.MAXIMUM_ORGANIZATION_FIELD_LENGTH < req.body[property].length) {
        throw new Error('invalid-organization-field-length')
      }
    }
  },
  patch: async (req) => {
    for (const property in req.body) {
      if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
        continue
      }
      await orgs.Organization.setProperty(req.query.organizationid, property, req.body[property])
    }
    req.success = true
    return orgs.Organization.load(req.query.organizationid)
  }
}
