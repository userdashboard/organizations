const dashboard = require('@userdashboard/dashboard')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    let membership = await dashboard.Storage.read(`${req.appid}/membership/${req.query.membershipid}`)
    if (!membership) {
      throw new Error('invalid-membershipid')
    }
    membership = JSON.parse(membership)
    if (membership.object !== 'membership') {
      throw new Error('invalid-membershipid')
    }
    delete (membership.code)
    return membership
  }
}
