const dashboard = require('@userdashboard/dashboard')
const organizations = require('../../../../../index.js')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.invitationid) {
      throw new Error('invalid-invitationid')
    }
    if (!req.body) {
      throw new Error('invalid-secret-code')
    }
    req.body['secret-code'] = req.body['secret-code'].trim ? req.body['secret-code'].trim() : req.body['secret-code']
    if (!req.body['secret-code'] || !req.body['secret-code'].length) {
      throw new Error('invalid-secret-code')
    }
    const secretCodeHash = await dashboard.Hash.sha512Hash(req.body['secret-code'], req.alternativesha512, req.alternativeDashboardEncryptionKey)
    const invitation = await global.api.user.organizations.OpenInvitation.get(req)
    if (!invitation) {
      throw new Error('invalid-invitationid')
    }
    if (invitation.accepted) {
      throw new Error('invalid-invitation')
    }
    const invitationsecretCodeHash = await organizations.StorageObject.getProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'secretCodeHash')
    if (invitationsecretCodeHash !== secretCodeHash) {
      throw new Error('invalid-secret-code')
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
    req.storage = organizations
    const profile = await global.api.user.Profile.get(req)
    if (!profile) {
      throw new Error('invalid-profileid')
    }
    const requireProfileFields = global.membershipProfileFields
    for (const field of requireProfileFields) {
      if (field === 'full-name') {
        if (!profile.firstName || !profile.lastName) {
          throw new Error('invalid-profile')
        }
        continue
      }
      const displayName = global.profileFieldMap[field]
      if (!profile[displayName]) {
        throw new Error('invalid-profile')
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
    await organizations.StorageObject.setProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'accepted', dashboard.Timestamp.now)
    const membershipid = `membership_${await dashboard.UUID.generateID()}`
    const membershipInfo = {
      object: 'membership',
      membershipid: membershipid,
      organizationid: invitation.organizationid,
      accountid: req.account.accountid,
      created: dashboard.Timestamp.now,
      invitationid: req.query.invitationid,
      profileid: req.body.profileid
    }
    await organizations.Storage.write(`${req.appid}/membership/${membershipid}`, membershipInfo)
    await organizations.StorageObject.setProperty(`${req.appid}/invitation/${req.query.invitationid}`, 'membershipid', membershipid)
    await organizations.StorageList.addMany({
      [`${req.appid}/memberships`]: membershipid,
      [`${req.appid}/account/memberships/${req.account.accountid}`]: membershipid,
      [`${req.appid}/account/organizations/${req.account.accountid}`]: organization.organizationid,
      [`${req.appid}/account/invitations/${req.account.accountid}`]: req.query.invitationid,
      [`${req.appid}/organization/memberships/${organization.organizationid}`]: membershipid
    })
    await organizations.Storage.write(`${req.appid}/map/organizationid/membershipid/${req.account.accountid}/${organization.organizationid}`, membershipid)
    return membershipInfo
  }
}
