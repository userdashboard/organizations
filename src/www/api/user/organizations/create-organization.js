module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.body || !req.body.name) {
      throw new Error('invalid-organization-name')
    }
    if (global.MINIMUM_ORGANIZATION_NAME_LENGTH > req.body.name.length ||
      global.MAXIMUM_ORGANIZATION_NAME_LENGTH < req.body.name.length) {
      throw new Error('invalid-organization-name-length')
    }
    for (const property in req.body) {
      if (property === 'name') {
        continue
      }
      if (global.ORGANIZATION_FIELDS.indexOf(property) === -1) {
        throw new Error('invalid-organization-field')
      }
      if (global.MAXIMUM_ORGANIZATION_FIELD_LENGTH < req.body[property].length) {
        throw new Error('invalid-organization-field-length')
      }
    }
  },
  post: async (req) => {
    const organization = await global.dashboard.organizations.Organization.create(req.account.accountid, req.body.name)
    await global.dashboard.organizations.Organization.setProperty(organization.organizationid, 'ip', req.ip)
    await global.dashboard.organizations.Organization.setProperty(organization.organizationid, 'userAgent', req.headers['user-agent'] || '')
    for (const property in req.body) {
      if (global.ORGANIZATION_FIELDS.indexOf(property) > -1) {
        await global.dashboard.organizations.Organization.setProperty(organization.organizationid, property, req.body[property])
      }
    }
    const membership = await global.dashboard.organizations.Membership.create(organization.organizationid, req.account.accountid)
    await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'ip', req.ip)
    await global.dashboard.organizations.Membership.setProperty(membership.membershipid, 'userAgent', req.headers['user-agent'] || '')
    return organization
  }
}
