const dashboard = require('@userappstore/dashboard')

module.exports = {
  accept,
  create,
  deleteAccount,
  deleteInvitation,
  generateID,
  load,
  loadMany
}

async function load (invitationid, ignoreDeletedInvitations) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.redisClient.hgetallAsync(invitationid)
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

async function create (organizationid, codeHash) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organizationid')
  }
  const invitationid = await generateID()
  const fieldsAndValues = [
    `object`, `invitation`,
    `organizationid`, organizationid,
    `invitationid`, invitationid,
    `code`, codeHash,
    `created`, dashboard.Timestamp.now
  ]
  await global.redisClient.hsetAsync(`map:invitations:organization:${organizationid}`, codeHash, invitationid)
  await global.redisClient.hmsetAsync(invitationid, fieldsAndValues)
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
  const ownerid = await global.redisClient.hgetAsync(organizationid, `ownerid`)
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
  await global.redisClient.hsetAsync(invitationid, 'accepted', dashboard.Timestamp.now)
  return load(invitation.invitationid)
}

async function deleteInvitation (invitationid) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitationid')
  }
  const invitation = await global.redisClient.hgetallAsync(invitationid)
  if (!invitation) {
    throw new Error('invalid-invitationid')
  }
  await global.redisClient.hdelAsync(`map:invitations:account:${invitation.organizationid}`, invitation.code)
  await global.redisClient.delAsync(invitationid)
  return true
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

async function deleteAccount (accountid) {
  if (!accountid || !accountid.length) {
    throw new Error('invalid-accountid')
  }
  const invitationids = await dashboard.RedisList.listAll(`account:invitations:${accountid}`)
  if (invitationids && invitationids.length) {
    for (const invitationid of invitationids) {
      await dashboard.RedisList.remove('invitations', invitationid)
      await global.redisClient.delAsync(invitationid)
    }
  }
  await global.redisClient.delAsync(`account:invitations:${accountid}`)
}
