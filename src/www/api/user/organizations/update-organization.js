const dashboard = require('@userappstore/dashboard')
const Organization = require('../../../../organization.js')

module.exports = {
  patch: async (req) => {
    if (!req || !req.account) {
      throw new Error('invalid-account')
    }
    if (!req.session) {
      throw new Error('invalid-session')
    }
    if (!req.query || !req.query.organizationid) {
      throw new Error('invalid-organizationid')
    }
    const organization = await Organization.load(req.query.organizationid)
    if (!organization || organization.ownerid !== req.account.accountid) {
      throw new Error('invalid-organization')
    }
    // require authorization
    if (!req.session.organizationUpdateRequested) {
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
      for (const property in req.body) {
        await dashboard.Session.setProperty(req.session.sessionid, `${property}Requested`, req.body[property])
      }
      await dashboard.Session.setProperty(req.session.sessionid, `organizationUpdateRequested`, true)
      await dashboard.Session.lock(req.session.sessionid, req.url)
      req.session = await dashboard.Session.load(req.session.sessionid)
      if (!req.session.unlocked) {
        return
      }
    }
    // apply authorized changes
    if (req.session.organizationUpdateRequested && req.session.unlocked >= dashboard.Timestamp.now) {
      await dashboard.Session.removeProperty(req.session.sessionid, 'organizationUpdateRequested')
      for (const propertyRequested in req.session) {
        const requestedIndex = propertyRequested.indexOf('Requested')
        if (requestedIndex === -1) {
          continue
        }
        const property = propertyRequested.substring(0, requestedIndex)
        if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
          continue
        }
        await dashboard.Session.removeProperty(req.session.sessionid, propertyRequested)
        await Organization.setProperty(req.query.organizationid, property, req.session[propertyRequested])
      }
      req.session = await dashboard.Session.load(req.session.sessionid)
      return
    }
    throw new Error('invalid-organization-field')
  }
}
