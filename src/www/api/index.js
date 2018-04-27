module.exports = {
  administrator: {
    organizations: {
      Invitation: require('./administrator/organizations/invitation.js'),
      Invitations: require('./administrator/organizations/invitations.js'),
      Membership: require('./administrator/organizations/membership.js'),
      Memberships: require('./administrator/organizations/memberships.js'),
      Organization: require('./administrator/organizations/organization.js'),
      Organizations: require('./administrator/organizations/organizations.js')
    }
  },
  user: {
    organizations: {
      AcceptInvitation: require('./user/organizations/accept-invitation.js'),
      CreateInvitation: require('./user/organizations/create-invitation.js'),
      CreateOrganization: require('./user/organizations/create-organization.js'),
      DeleteInvitation: require('./user/organizations/delete-invitation.js'),
      DeleteMembership: require('./user/organizations/delete-membership.js'),
      DeleteOrganization: require('./user/organizations/delete-organization.js'),
      Invitation: require('./user/organizations/invitation.js'),
      Invitations: require('./user/organizations/invitations.js'),
      Membership: require('./user/organizations/membership.js'),
      Memberships: require('./user/organizations/memberships.js'),
      Organization: require('./user/organizations/organization.js'),
      Organizations: require('./user/organizations/organizations.js'),
      TransferOrganization: require('./user/organizations/transfer-organization.js'),
      UpdateMembership: require('./user/organizations/update-membership.js'),
      UpdateOrganization: require('./user/organizations/update-organization.js')
    }
  }
}
