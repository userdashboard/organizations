const dashboard = require('@userappstore/dashboard')
const orgs = require('../../../../../index.js')

module.exports = {
  lock: true,
  before: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    if (req.body && !req.body.codeHash) {
      if (!req.body || !req.body.code) {
        throw new Error('invalid-invitation-code')
      }
      if (global.minimumInvitationCodeLength > req.body.code.length ||
        global.maximumInvitationCodeLength < req.body.code.length) {
        throw new Error('invalid-invitation-code-length')
      }
      req.body.codeHash = dashboard.Hash.fixedSaltHash(req.body.code)
      delete (req.body.code)
      if (!req.body.name || !req.body.name.length) {
        throw new Error('invalid-membership-name')
      }
      if (global.minimumMembershipNameLength > req.body.name.length ||
        global.maximumMembershipNameLength < req.body.name.length) {
        throw new Error('invalid-membership-name-length')
      }
      if (!req.body.email || !req.body.email.length) {
        throw new Error('invalid-membership-email')
      }
    }
    const invitation = await global.api.user.organizations.OpenInvitation.get(req)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const invitationCodeHash = await dashboard.StorageObject.getProperty(`${req.appid}/${req.query.invitationid}`, 'codeHash')
    if (invitationCodeHash !== req.body.codeHash) {
      throw new Error('invalid-invitation-code')
    }
    req.query.organizationid = invitation.organizationid
    const organization = await global.api.user.organizations.OpenInvitationOrganization.get(req)
    if (!organization) {
      throw new Error('invalid-organizationid')
    }
    if (req.account.accountid === organization.ownerid) {
      throw new Error('invalid-account')
    }
    let membership
    try {
      membership = await global.api.user.organizations.OrganizationMembership._get(req)
    } catch (error) {
    }
    if (membership) {
      throw new Error('invalid-account')
    }
    req.data = { organization, invitation }
  },
  post: async (req) => {
    await dashboard.StorageObject.setProperty(`${req.appid}/${req.query.invitationid}`, 'accepted', dashboard.Timestamp.now)
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: `membership`,
      membershipid: membershipid,
      organizationid: req.data.invitation.organizationid,
      accountid: req.account.accountid,
      created: dashboard.Timestamp.now,
      name: req.body.name,
      email: req.body.email,
      invitationid: req.query.invitationid
    }
    await dashboard.Storage.write(`${req.appid}/${membershipid}`, membershipInfo)
    await dashboard.StorageObject.setProperty(`${req.appid}/${req.query.invitationid}`, 'membershipid', membershipid)
    await dashboard.StorageList.add(`${req.appid}/memberships`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/account/memberships/${req.account.accountid}`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/account/organizations/${req.account.accountid}`, req.data.organization.organizationid)
    await dashboard.StorageList.add(`${req.appid}/account/invitations/${req.account.accountid}`, req.query.invitationid)
    await dashboard.StorageList.add(`${req.appid}/organization/memberships/${req.data.organization.organizationid}`, membershipid)
    await dashboard.Storage.write(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${req.data.organization.organizationid}`, membershipid)
    req.success = true
    return membershipInfo
  }
}
