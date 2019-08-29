const dashboard = require('@userdashboard/dashboard')

module.exports = {
  post: async (req) => {
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
      req.body.codeHash = await dashboard.Hash.fixedSaltHash(req.body.code, req.alternativeFixedSalt, req.alternativeDashboardEncryptionKey)
    }
    const invitation = await global.api.user.organizations.OpenInvitation.get(req)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const invitationCodeHash = await dashboard.StorageObject.getProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'codeHash')
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
    if (!req.body.profileid || !req.body.profileid.length) {
      throw new Error('invalid-profileid')
    }
    req.query.profileid = req.body.profileid
    const profile = await global.api.user.Profile.get(req)
    if (!profile) {
      throw new Error('invalid-profileid')
    }
    const requireProfileFields = global.membershipProfileFields
    for (const field of requireProfileFields) {
      let displayName = field
      if (displayName.indexOf('-') > -1) {
        displayName = displayName.split('-')
        if (displayName.length === 1) {
          displayName = displayName[0]
        } else if (displayName.length === 2) {
          displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1)
        } else if (displayName.length === 3) {
          displayName = displayName[0] + displayName[1].substring(0, 1).toUpperCase() + displayName[1].substring(1) + displayName[2].substring(0, 1).toUpperCase() + displayName[2].substring(1)
        }
      }
      if (field === 'full-name') {
        if (!profile.firstName || !profile.lastName) {
          throw new Error(`invalid-profile`)
        }
        continue
      }
      if (!profile[displayName]) {
        throw new Error(`invalid-profile`)
      }
    }
    let membership
    try {
      membership = await global.api.user.organizations.OrganizationMembership.get(req)
    } catch (error) {
    }
    if (membership) {
      throw new Error('invalid-account')
    }
    await dashboard.StorageObject.setProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'accepted', dashboard.Timestamp.now)
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: `membership`,
      membershipid: membershipid,
      organizationid: invitation.organizationid,
      accountid: req.account.accountid,
      created: dashboard.Timestamp.now,
      invitationid: req.query.invitationid,
      profileid: req.body.profileid
    }
    await dashboard.Storage.write(`${req.appid}/membership/${membershipid}`, membershipInfo)
    await dashboard.StorageObject.setProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'membershipid', membershipid)
    await dashboard.StorageList.add(`${req.appid}/memberships`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/account/memberships/${req.account.accountid}`, membershipid)
    await dashboard.StorageList.add(`${req.appid}/account/organizations/${req.account.accountid}`, organization.organizationid)
    await dashboard.StorageList.add(`${req.appid}/account/invitations/${req.account.accountid}`, req.query.invitationid)
    await dashboard.StorageList.add(`${req.appid}/organization/memberships/${organization.organizationid}`, membershipid)
    await dashboard.Storage.write(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${organization.organizationid}`, membershipid)
    req.success = true
    return membershipInfo
  }
}
