const dashboard = require('@userappstore/dashboard')
const Membership = require('../../../../membership.js')

module.exports = {
  patch: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.membershipid) {
      throw new Error('invalid-membershipid')
    }
    const membership = await Membership.load(req.query.membershipid)
    if (!membership || membership.accountid !== req.account.accountid) {
      throw new Error('invalid-membership')
    }
    // require authorization
    if (!req.session.membershipUpdateRequested) {
      if (!req.body) {
        throw new Error('invalid-membership-field')
      }
      for (const property in req.body) {
        if (global.MEMBERSHIP_FIELDS.indexOf(property) === -1) {
          throw new Error('invalid-membership-field')
        }
        if (global.MAXIMUM_MEMBERSHIP_FIELD_LENGTH < req.body[property].length) {
          throw new Error('invalid-membership-field-length')
        }
      }
      for (const property in req.body) {
        await dashboard.Session.setProperty(req.session.sessionid, `${property}Requested`, req.body[property])
      }
      await dashboard.Session.setProperty(req.session.sessionid, `membershipUpdateRequested`, true)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.membershipUpdateRequested && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'membershipUpdateRequested')
      for (const propertyRequested in req.session) {
        const requestedIndex = propertyRequested.indexOf('Requested')
        if (requestedIndex === -1) {
          continue
        }
        const property = propertyRequested.substring(0, requestedIndex)
        if (global.MEMBERSHIP_FIELDS.indexOf(property) === -1) {
          continue
        }
        await dashboard.Session.removeProperty(req.session.sessionid, propertyRequested)
        await Membership.setProperty(req.query.membershipid, property, req.session[propertyRequested])
      }
      req.session = await dashboard.Session.load(req.session.sessionid)
      return
    }
    throw new Error('invalid-membership-field')
  }
}
