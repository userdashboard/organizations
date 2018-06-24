const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const count = await dashboard.RedisList.count(`organization:invitations:${req.query.organizationid}`)
    return count
  }
}
