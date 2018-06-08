const orgs = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await orgs.Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    const offset = req.query && req.query.offset ? parseInt(req.query.offset, 10) : 0
    const invitations = await orgs.Invitation.listByOrganization(req.query.organizationid, offset)
    if (!invitations || !invitations.length) {
      return null
    }
    for (const invitation of invitations) {
      delete (invitation.code)
    }
    return invitations
  }
}
