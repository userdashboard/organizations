const dashboard = require('@userappstore/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const count = await dashboard.RedisList.count(`account:invitations:${req.query.accountid}`)
    return count
  }
}
