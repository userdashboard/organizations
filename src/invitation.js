const dashboard = require('@userappstore/dashboard')

module.exports = {
  accept,
  count,
  countAll,
  countByOrganization,
  create,
  deleteInvitation,
  generateID,
  getProperty,
  list,
  listAll,
  listAllByOrganization,
  listByOrganization,
  load,
  loadMany,
  removeProperty,
  setProperty
}

async function load (invitationid, ignoreDeletedInvitations) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.redisClient.hgetallAsync(`invitation:${invitationid}`)
  if (!invitation) {
    if (!ignoreDeletedInvitations) {
      throw new Error('invalid-invitationid')
    }
    return
  }
  for (const field in invitation) {
    try {
      const intValue = parseInt(invitation[field], 10)
      if (intValue.toString() === invitation[field]) {
        invitation[field] = intValue
      }
    } catch (error) {

    }
  }
  return invitation
}

async function count (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  return global.redisClient.llenAsync(`invitations:account:${accountid}`) || 0
}

async function countAll () {
  return global.redisClient.llenAsync(`invitations`) || 0
}

async function countByOrganization (organizationid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  return global.redisClient.llenAsync(`invitations:organization:${organizationid}`) || 0
}

async function create (organizationid, codeHash) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  const ownerid = await global.redisClient.hgetAsync(`organization:${organizationid}`, `ownerid`)
  const invitationid = await generateID()
  const fieldsAndValues = [
    `organizationid`, organizationid,
    `invitationid`, invitationid,
    `code`, codeHash,
    `created`, dashboard.Timestamp.now
  ]
  await global.redisClient.hsetAsync(`map:invitations:organization:${organizationid}`, codeHash, invitationid)
  await global.redisClient.lpushAsync(`invitations:organization:${organizationid}`, invitationid)
  await global.redisClient.lpushAsync(`invitations:account:${ownerid}`, invitationid)
  await global.redisClient.hmsetAsync(`invitation:${invitationid}`, fieldsAndValues)
  await global.redisClient.lpushAsync('invitations', invitationid)
  await dashboard.Account.setProperty(ownerid, 'invitation_lastCreated', dashboard.Timestamp.now)
  return load(invitationid)
}

async function generateID () {
  const id = await dashboard.UUID.generateID()
  return `invitation_${id}`
}

async function accept (organizationid, code, accountid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  if (!code || !code.length) {
    throw new Error('invalid-invitation-code')
  }
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const ownerid = await global.redisClient.hgetAsync(`organization:${organizationid}`, `ownerid`)
  if (accountid === ownerid) {
    throw new Error('invalid-account')
  }
  const codeHash = dashboard.Hash.fixedSaltHash(code)
  const invitationid = await global.redisClient.hgetAsync(`map:invitations:organization:${organizationid}`, codeHash)
  if (!invitationid) {
    throw new Error('invalid-invitation-code')
  }
  const invitation = await load(invitationid)
  if (!invitation || invitation.accepted) {
    throw new Error('invalid-invitation')
  }
  await dashboard.Account.setProperty(ownerid, 'invitation_lastAccepted', dashboard.Timestamp.now)
  await setProperty(invitationid, 'accepted', accountid)
  return invitation
}

async function deleteInvitation (invitationid) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.redisClient.hgetallAsync(`invitation:${invitationid}`)
  if (!invitation) {
    throw new Error('invalid-invitationid')
  }
  const ownerid = await global.redisClient.hgetAsync(`organization:${invitation.organizationid}`, `ownerid`)
  await global.redisClient.lremAsync(`invitations:organization:${invitation.organizationid}`, 1, invitationid)
  await global.redisClient.hdelAsync(`map:invitations:account:${invitation.organizationid}`, invitation.code)
  await global.redisClient.delAsync(`invitation:${invitationid}`)
  await dashboard.Account.setProperty(ownerid, 'invitation_lastDeleted', dashboard.Timestamp.now)
  await global.redisClient.lremAsync('invitations', 1, invitationid)
  return true
}

async function list (accountid, offset) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  offset = offset || 0
  const invitationids = await global.redisClient.lrangeAsync(`invitations:account:${accountid}`, offset, offset + global.PAGE_SIZE - 1)
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids)
}

async function listAll (accountid, offset) {
  offset = offset || 0
  let invitationids
  if (accountid) {
    invitationids = await global.redisClient.lrangeAsync(`invitations:account:${accountid}`, offset, offset + global.PAGE_SIZE - 1)
  } else {
    invitationids = await global.redisClient.lrangeAsync(`invitations`, offset, offset + global.PAGE_SIZE - 1)
  }
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids, true)
}

async function listAllByOrganization (organizationid, offset) {
  offset = offset || 0
  let invitationids
  if (organizationid) {
    invitationids = await global.redisClient.lrangeAsync(`invitations:organization:${organizationid}`, offset, offset + global.PAGE_SIZE - 1)
  } else {
    invitationids = await global.redisClient.lrangeAsync(`invitations`, offset, offset + global.PAGE_SIZE - 1)
  }
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids, true)
}

async function listByOrganization (organizationid, offset) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  offset = offset || 0
  const invitationids = await global.redisClient.lrangeAsync(`invitations:organization:${organizationid}`, offset, offset + global.PAGE_SIZE - 1)
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids)
}

async function loadMany (invitationids, ignoreDeletedInvitations) {
  if (!invitationids || !invitationids.length) {
    throw new Error('invalid-invitationids')
  }
  const invitations = []
  for (let i = 0, len = invitationids.length; i < len; i++) {
    const invitation = await load(invitationids[i], ignoreDeletedInvitations)
    if (!invitation) {
      continue
    }
    invitations.push(invitation)
  }
  return invitations
}

async function setProperty (invitationid, property, value) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  if (!property || !property.length || value == null || value === undefined) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hsetAsync(`invitation:${invitationid}`, property, value)
}

async function getProperty (invitationid, property) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  return global.redisClient.hgetAsync(`invitation:${invitationid}`, property)
}

async function removeProperty (invitationid, property) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hdelAsync(`invitation:${invitationid}`, property)
}
