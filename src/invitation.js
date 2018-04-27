const dashboard = require('@userappstore/dashboard')
const Organization = require('./organization.js')

module.exports = {
  accept,
  create,
  deleteInvitation,
  generateID,
  getProperty,
  list,
  listAll,
  load,
  loadMany,
  removeProperty,
  setProperty
}

async function load (invitationid, ignoreDeletedAccounts) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitation')
  }
  const invitation = await global.redisClient.hgetallAsync(`invitation:${invitationid}`)
  if (!invitation) {
    throw new Error('invalid-invitation')
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
    throw new Error('invalid-organization')
  }
  const organization = await Organization.load(organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  const account = await dashboard.Account.load(organization.ownerid)
  if (!account || account.deleted) {
    throw new Error('invalid-organization')
  }
  const invitationid = await generateID()
  const fieldsAndValues = [
    `organizationid`, organizationid,
    `invitationid`, invitationid,
    `code`, codeHash,
    `created`, dashboard.Timestamp.now
  ]
  await global.redisClient.hsetAsync(`map:invitations:${organizationid}`, codeHash, invitationid)
  await global.redisClient.lpushAsync(`invitations:${organizationid}`, invitationid)
  await global.redisClient.hmsetAsync(`invitation:${invitationid}`, fieldsAndValues)
  await global.redisClient.lpushAsync('invitations', invitationid)
  await dashboard.Account.setProperty(account.accountid, 'invitation_lastCreated', dashboard.Timestamp.now)
  return load(invitationid)
}

async function generateID () {
  const id = await dashboard.UUID.generateID()
  return `invitation_${id}`
}

async function accept (organizationid, code, accountid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organization')
  }
  if (!code || !code.length) {
    throw new Error('invalid-invitation-code')
  }
  if (!accountid || !accountid.length) {
    throw new Error('invalid-account')
  }
  const organization = await Organization.load(organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  if (accountid === organization.ownerid) {
    throw new Error('invalid-account')
  }
  const account = await dashboard.Account.load(accountid)
  if (!account || account.deleted) {
    throw new Error('invalid-account')
  }
  const owner = await dashboard.Account.load(organization.ownerid)
  if (!owner || owner.deleted) {
    throw new Error('invalid-organization')
  }
  const codeHash = dashboard.Hash.fixedSaltHash(code)
  const invitationid = await global.redisClient.hgetAsync(`map:invitations:${organizationid}`, codeHash)
  if (!invitationid) {
    throw new Error('invalid-invitation-code')
  }
  const invitation = await load(invitationid)
  if (!invitation || invitation.accepted) {
    throw new Error('invalid-invitation')
  }
  await dashboard.Account.setProperty(owner.accountid, 'invitation_lastAccepted', dashboard.Timestamp.now)
  await setProperty(invitationid, 'accepted', accountid)
  return invitation
}

async function deleteInvitation (invitationid) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitation')
  }
  const invitation = await global.redisClient.hgetallAsync(`invitation:${invitationid}`)
  if (!invitation) {
    throw new Error('invalid-invitation')
  }
  const organization = await Organization.load(invitation.organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  const owner = await dashboard.Account.load(organization.ownerid)
  if (!owner || owner.deleted) {
    throw new Error('invalid-invitation')
  }
  await global.redisClient.lremAsync(`invitations:organization:${invitation.organizationid}`, 1, invitationid)
  await global.redisClient.hdelAsync(`map:invitations:account:${organization.organizationid}`, invitation.code)
  await global.redisClient.delAsync(`invitation:${invitationid}`)
  await dashboard.Account.setProperty(owner.accountid, 'invitation_lastDeleted', dashboard.Timestamp.now)
  await global.redisClient.lremAsync('invitations', 1, invitationid)
  return true
}

async function list (organizationid) {
  if (!organizationid || !organizationid.length) {
    throw new Error('invalid-organization')
  }
  const organization = await Organization.load(organizationid)
  if (!organization) {
    throw new Error('invalid-organization')
  }
  const owner = await dashboard.Account.load(organization.ownerid)
  if (!owner || owner.deleted) {
    throw new Error('invalid-organization')
  }
  const invitationids = await global.redisClient.lrangeAsync(`invitations:${organizationid}`, 0, -1)
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids)
}

async function listAll (organizationid) {
  let invitationids
  if (organizationid) {
    const organization = await Organization.load(organizationid)
    if (!organization) {
      throw new Error('invalid-organization')
    }
    invitationids = await global.redisClient.lrangeAsync(`invitations:${organizationid}`, 0, -1)
  } else {
    invitationids = await global.redisClient.lrangeAsync(`invitations`, 0, -1)
  }
  if (!invitationids || !invitationids.length) {
    return
  }
  return loadMany(invitationids, true)
}

async function loadMany (invitationids, ignoreDeletedAccounts) {
  if (!invitationids || !invitationids.length) {
    return
  }
  const invitations = []
  for (let i = 0, len = invitationids.length; i < len; i++) {
    const invitation = await load(invitationids[i], ignoreDeletedAccounts)
    if (!invitation) {
      continue
    }
    invitations.push(invitation)
  }
  return invitations
}

async function setProperty (invitationid, property, value) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitation')
  }
  if (!property || !property.length || value == null || value === undefined) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hsetAsync(`invitation:${invitationid}`, property, value)
}

async function getProperty (invitationid, property) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitation')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  return global.redisClient.hgetAsync(`invitation:${invitationid}`, property)
}

async function removeProperty (invitationid, property) {
  if (!invitationid || !invitationid.length) {
    throw new Error('invalid-invitation')
  }
  if (!property || !property.length) {
    throw new Error('invalid-property')
  }
  await global.redisClient.hdelAsync(`invitation:${invitationid}`, property)
}
