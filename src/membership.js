const dashboard = require('@userappstore/dashboard')

module.exports = {
  create,
  deleteAccount,
  deleteMembership,
  generateID,
  isMember,
  load,
  loadMany
}

async function load (membershipid, ignoreDeletedMemberships) {
  if (!membershipid || !membershipid.length) {
    throw new Error('invalid-membershipid')
  }
  const membership = await global.redisClient.hgetallAsync(membershipid)
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
  const organization = await global.redisClient.hgetallAsync(organizationid)
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
  await global.redisClient.hmsetAsync(membershipid, fieldsAndValues)
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
  const membership = await global.redisClient.hgetallAsync(membershipid)
  if (!membership) {
    throw new Error('invalid-membershipid')
  }
  await global.redisClient.delAsync(membershipid)
  return true
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
  const membershipids = await dashboard.RedisList.listAll(`account:memberships:${accountid}`)
  if (membershipids && membershipids.length) {
    const memberships = await loadMany(membershipids)
    for (const membership of memberships) {
      if (organizationid === membership.organizationid) {
        return true
      }
    }
  }
  return false
}

async function deleteAccount (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const membershipids = await dashboard.RedisList.listAll(`account:memberships:${accountid}`)
  if (membershipids && membershipids.length) {
    for (const membershipid of membershipids) {
      await dashboard.RedisList.remove('memberships', membershipid)
      await global.redisClient.delAsync(membershipid)
    }
  }
  await global.redisClient.delAsync(`account:memberships:${accountid}`)
}
