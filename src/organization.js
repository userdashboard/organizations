const dashboard = require('@userappstore/dashboard')

module.exports = {
  create,
  deleteAccount,
  deleteOrganization,
  generateID,
  load,
  loadMany
}

async function load (organizationid, ignoreDeletedOrganization) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  const organization = await global.redisClient.hgetallAsync(organizationid)
  if (!organization) {
    if (!ignoreDeletedOrganization) {
      throw new Error('invalid-organizationid')
    }
    return null
  }
  for (const field in organization) {
    try {
      const intValue = parseInt(organization[field], 10)
      if (intValue.toString() === organization[field]) {
        organization[field] = intValue
      }
    } catch (error) {

    }
  }
  return organization
}

async function create (accountid, name) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  if (!name || !name.length) {
    throw new Error('invalid-organization-name')
  }
  if (global.MINIMUM_ORGANIZATION_NAME_LENGTH > name.length ||
    name.length > global.MAXIMUM_ORGANIZATION_NAME_LENGTH) {
    throw new Error('invalid-organization-name-length')
  }
  const organizationid = await generateID()
  const fieldsAndValues = [
    `object`, `organization`,
    `ownerid`, accountid,
    `organizationid`, organizationid,
    `name`, name,
    `created`, dashboard.Timestamp.now
  ]
  await global.redisClient.hmsetAsync(organizationid, fieldsAndValues)
  return load(organizationid)
}

async function generateID () {
  const id = await dashboard.UUID.generateID()
  return `organization_${id}`
}

async function deleteOrganization (organizationid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  const organization = await global.redisClient.hgetallAsync(organizationid)
  if (!organization) {
    throw new Error('invalid-organizationid')
  }
  await global.redisClient.delAsync(organizationid)
  return true
}

async function loadMany (organizationids, ignoreDeletedOrganization) {
  if (!organizationids || !organizationids.length) {
    throw new Error('invalid-organizationids')
  }
  const organizations = []
  for (let i = 0, len = organizationids.length; i < len; i++) {
    const organization = await load(organizationids[i], ignoreDeletedOrganization)
    if (!organization) {
      continue
    }
    organizations.push(organization)
  }
  return organizations
}

async function deleteAccount (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const organizationids = await dashboard.RedisList.listAll(`account:organizations:${accountid}`)
  if (organizationids && organizationids.length) {
    for (const organizationid of organizationids) {
      await global.redisClient.delAsync(organizationid)
      await dashboard.RedisList.remove('organizations', organizationid)
    }
  }
  await global.redisClient.delAsync(`account:organizations:${accountid}`)
}
