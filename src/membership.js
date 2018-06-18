const dashboard = require('@userappstore/dashboard')

module.exports = {
  count,
  countAll,
  countByOrganization,
  create,
  deleteAccount,
  deleteMembership,
  generateID,
  getProperty,
  isMember,
  listAll,
  listByOrganization,
  list,
  load,
  loadMany,
  removeProperty,
  setProperty
}

async function count (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  return global.redisClient.llenAsync(`memberships:account:${accountid}`) || 0
}

async function countAll () {
  return global.redisClient.llenAsync(`memberships`) || 0
}

async function countByOrganization (organizationid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  return global.redisClient.llenAsync(`memberships:organization:${organizationid}`) || 0
}

async function load (membershipid, ignoreDeletedMemberships) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.redisClient.hgetallAsync(`membership:${membershipid}`)
  if (!membership) {
    if (!ignoreDeletedMemberships) {
      throw new Error('invalid-membershipid')
    }
    return null
  }
  for (const field in membership) {
    try {
      const intValue = parseInt(membership[field], 10)
      if (intValue.toString() === membership[field]) {
        membership[field] = intValue
      }
    } catch (error) {

    }
  }
  return membership
}

async function create (organizationid, accountid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const organization = await global.redisClient.hgetallAsync(`organization:${organizationid}`)
  if (!organization) {
    throw new Error('invalid-organizationid')
  }
  const membershipid = await generateID()
  const fieldsAndValues = [
    `object`, `membership`,
    `membershipid`, membershipid,
    `organizationid`, organizationid,
    `accountid`, accountid,
    `created`, dashboard.Timestamp.now
  ]
  await global.redisClient.lpushAsync(`memberships:account:${accountid}`, membershipid)
  await global.redisClient.lpushAsync(`memberships:organization:${organizationid}`, membershipid)
  await global.redisClient.hmsetAsync(`membership:${membershipid}`, fieldsAndValues)
  await global.redisClient.lpushAsync('memberships', membershipid)
  await dashboard.Account.setProperty(accountid, 'membership_lastCreated', dashboard.Timestamp.now)
  const membership = await load(membershipid)
  return membership
}

async function generateID () {
  const id = await dashboard.UUID.generateID()
  return `membership_${id}`
}

async function deleteMembership (membershipid) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.redisClient.hgetallAsync(`membership:${membershipid}`)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  await global.redisClient.lremAsync(`memberships:organization:${membership.organizationid}`, 1, membershipid)
  await global.redisClient.lremAsync(`memberships:account:${membership.accountid}`, 1, membershipid)
  await global.redisClient.delAsync(`membership:${membershipid}`)
  await dashboard.Account.setProperty(membership.accountid, 'membership_lastDeleted', dashboard.Timestamp.now)
  await global.redisClient.lremAsync('memberships', 1, membershipid)
  return true
}

async function listByOrganization (organizationid, offset) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  offset = offset || 0
  const membershipids = await global.redisClient.lrangeAsync(`memberships:organization:${organizationid}`, offset, offset + global.PAGE_SIZE - 1)
  if (!membershipids || !membershipids.length) {
    return
  }
  return loadMany(membershipids)
}

async function list (accountid, offset) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  offset = offset || 0
  const membershipids = await global.redisClient.lrangeAsync(`memberships:account:${accountid}`, offset, offset + global.PAGE_SIZE - 1)
  if (!membershipids || !membershipids.length) {
    return null
  }
  return loadMany(membershipids)
}

async function listAll (offset) {
  offset = offset || 0
  const membershipids = await global.redisClient.lrangeAsync(`memberships`, offset, offset + global.PAGE_SIZE - 1)
  if (!membershipids || !membershipids.length) {
    return
  }
  return loadMany(membershipids, true)
}

async function loadMany (membershipids, ignoreDeletedMemberships) {
  if (!membershipids || !membershipids.length) {
    return
  }
  const memberships = []
  for (let i = 0, len = membershipids.length; i < len; i++) {
    const membership = await load(membershipids[i], ignoreDeletedMemberships)
    if (!membership) {
      continue
    }
    memberships.push(membership)
  }
  return memberships
}

async function isMember (organizationid, accountid) {
  const memberships = await list(accountid)
  if (memberships && memberships.length) {
    for (const membership of memberships) {
      if (organizationid === membership.organizationid) {
        return true
      }
    }
  }
  return false
}

async function setProperty (membershipid, property, value) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  if (!property || !property.length || value == null || value === undefined) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hsetAsync(`membership:${membershipid}`, property, value)
}

async function getProperty (membershipid, property) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  return global.redisClient.hgetAsync(`membership:${membershipid}`, property)
}

async function removeProperty (membershipid, property) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hdelAsync(`membership:${membershipid}`, property)
}

async function deleteAccount (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const membershipids = await global.redisClient.lrangeAsync(`memberships:account:${accountid}`, 0, -1)
  if (membershipids && membershipids.length) {
    for (const membershipid of membershipids) {
      await global.redisClient.delAsync(`membership:${membershipid}`)
      await global.redisClient.lremAsync('memberships', 1, membershipid)
    }
  }
  await global.redisClient.delAsync(`memberships:account:${accountid}`)
}
