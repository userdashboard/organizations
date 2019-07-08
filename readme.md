# Organizations for Dashboard

[Dashboard](https://github.com/userdashboard/dashboard) is a NodeJS project that provides a reusable account management system for web applications.  This module adds a complete user and administrator `Private API` and `Web UI` for user organizations.

# Dashboard

Dashboard proxies your application server to create a single website where pages like signing in or changing your password are provided by Dashboard.  Your application server can be anything you want, and use Dashboard's API to access data as required.  Using modules you can expand Dashboard to include organizations, subscriptions powered by Stripe, or a Stripe Connect platform.

- [Introduction](https://github.com/userdashboard/dashboard/wiki)
- [Configuring Dashboard](https://github.com/userdashboard/dashboard/wiki/Configuring-Dashboard)
- [Dashboard code structure](https://github.com/userdashboard/dashboard/wiki/Dashboard-code-structure)
- [Server request lifecycle](https://github.com/userdashboard/dashboard/wiki/Server-Request-Lifecycle)

### Demonstrations

- [Dashboard](https://dashboard-demo-2344.herokuapp.com)
- [Dashboard + Organizations module](https://organizations-demo-7933.herokuapp.com)
- [Dashboard + Stripe Subscriptions module](https://stripe-subscriptions-5701.herokuapp.com)
- [Dashboard + Stripe Connect module](https://stripe-connect-8509.herokuapp.com)

## Access organization information from your application server

| URL                                                             | Method | Querystring         | POST data  |
|-----------------------------------------------------------------|--------|---------------------|------------|
|/api/administrator/organizations/account-invitations             | GET    | accountid=          |            |
|/api/administrator/organizations/account-invitations-count       | GET    | accountid=          |            |
|/api/administrator/organizations/account-memberships             | GET    | accountid=          |            |
|/api/administrator/organizations/account-memberships-count       | GET    | accountid=          |            |
|/api/administrator/organizations/account-organizations           | GET    | accountid=          |            |
|/api/administrator/organizations/account-organizations-count     | GET    | accountid=          |            |
|/api/administrator/organizations/invitation                      | GET    | invitationid=       |            |
|/api/administrator/organizations/invitations                     | GET    | -                   |            |
|/api/administrator/organizations/invitations-count               | GET    | -                   |            |
|/api/administrator/organizations/membership                      | GET    | membershipid=       |            |
|/api/administrator/organizations/memberships                     | GET    | -                   |            |
|/api/administrator/organizations/memberships-count               | GET    | -                   |            |
|/api/administrator/organizations/organization                    | GET    | organizationid=     |            |
|/api/administrator/organizations/organization-invitations        | GET    | organizationid=     |            |
|/api/administrator/organizations/organization-invitations-count  | GET    |organizationid=      |            |
|/api/administrator/organizations/organization-memberships        | GET    | organizationid=     |            |
|/api/administrator/organizations/organization-memberships-count  | GET    | organizationid=     |            |
|/api/administrator/organizations/organizations                   | GET    | -                   |            |
|/api/administrator/organizations/organizations-count             | GET    | -                   |            |
|/api/user/organizations/create-invitation                        | POST   | organizationid=     | code=      |
|/api/user/organizations/create-membership                        | POST   | invitationid=       | code=&name=&email= |
|/api/user/organizations/create-organization                      | POST   | accountid=          | name=&email= |
|/api/user/organizations/delete-invitation                        | DELETE | invitationid=       |            |
|/api/user/organizations/delete-membership                        | DELETE | membershipid=       |            |
|/api/user/organizations/delete-organization                      | DELETE | organizationid=     |            |
|/api/user/organizations/invitation                               | GET    | invitationid=       |            |
|/api/user/organizations/invitations                              | GET    | accountid=          |            |
|/api/user/organizations/invitations-count                        | GET    | accountid=          |            |
|/api/user/organizations/membership                               | GET    | membershipid=       |            |
|/api/user/organizations/memberships                              | GET    | accountid=          |            |
|/api/user/organizations/memberships-count                        | GET    | accountid=          |            |
|/api/user/organizations/open-invitation                          | GET    | invitationid=       |            |
|/api/user/organizations/open-invitation-organization             | GET    | invitationid=       |            |
|/api/user/organizations/organization                             | GET    | organizationid=     |            |
|/api/user/organizations/organization-invitations                 | GET    | organizationid=     |            |
|/api/user/organizations/organization-invitations-count           | GET    | organizationid=     |            |
|/api/user/organizations/organization-membership                  | GET    | organizationid=     |            |
|/api/user/organizations/organization-memberships                 | GET    | organizationid=     |            |
|/api/user/organizations/organization-memberships-count           | GET    | organizationid=     |            |
|/api/user/organizations/organizations                            | GET    | accountid=          |            |
|/api/user/organizations/organizations-count                      | GET    | accountid=          |            |
|/api/user/organizations/set-organization-owner                   | PATCH  | organizationid=     | accountid= |
|/api/user/organizations/update-membership                        | PATCH  | membershipid=       | name=&email= |
|/api/user/organizations/update-organization                      | PATCH  | organizationid=     | name=&email= |

## Access organization information from the dashboard server

| Method                                                                       | Querystring         | POST data  |
|------------------------------------------------------------------------------|---------------------|------------|
|global.api.administrator.organizations.AccountInvitations.get(req)            | accountid=          |            |
|global.api.administrator.organizations.AccountInvitationsCount.get(req)       | accountid=          |            |
|global.api.administrator.organizations.AccountMemberships.get(req)            | accountid=          |            |
|global.api.administrator.organizations.AccountMembershipsCount.get(req)       | accountid=          |            |
|global.api.administrator.organizations.AccountOrganizations.get(req)          | accountid=          |            |
|global.api.administrator.organizations.AccountOrganizationsCount.get(req)     | accountid=          |            |
|global.api.administrator.organizations.Invitation.get(req)                    | invitationid=       |            |
|global.api.administrator.organizations.Invitations.get(req)                   | -                   |            |
|global.api.administrator.organizations.InvitationsCount.get(req)              | -                   |            |
|global.api.administrator.organizations.Membership.get(req)                    | membershipid=       |            |
|global.api.administrator.organizations.Memberships.get(req)                   | -                   |            |
|global.api.administrator.organizations.MembershipsCount.get(req)              | -                   |            |
|global.api.administrator.organizations.Organization.get(req)                  | organizationid=     |            |
|global.api.administrator.organizations.OrganizationInvitations.get(req)       | organizationid=     |            |
|global.api.administrator.organizations.OrganizationInvitationsCount.get(req)  | organizationid=     |            |
|global.api.administrator.organizations.OrganizationMemberships.get(req)       | organizationid=     |            |
|global.api.administrator.organizations.OrganizationMembershipsCount.get(req)  | organizationid=     |            |
|global.api.administrator.organizations.Organizations.get(req)                 | -                   |            |
|global.api.administrator.organizations.OrganizationsCount.get(req)            | -                   |            |
|global.api.user.organizations.CreateInvitation.post(req)                      | organizationid=     | code=      |
|global.api.user.organizations.CreateMembership.post(req)                      | invitationid=       | code=&name=&email= |
|global.api.user.organizations.CreateOrganization.post(req)                    | accountid=          | name=&email= |
|global.api.user.organizations.DeleteInvitation.delete(req)                    | invitationid=       |            |
|global.api.user.organizations.DeleteMembership.delete(req)                    | membershipid=       |            |
|global.api.user.organizations.DeleteOrganization.delete(req)                  | organizationid=     |            |
|global.api.user.organizations.Invitation.get(req)                             | invitationid=       |            |
|global.api.user.organizations.Invitations.get(req)                            | accountid=          |            |
|global.api.user.organizations.InvitationsCount.get(req)                       | accountid=          |            |
|global.api.user.organizations.Membership.get(req)                             | membershipid=       |            |
|global.api.user.organizations.Memberships.get(req)                            | accountid=          |            |
|global.api.user.organizations.MembershipsCount.get(req)                       | accountid=          |            |
|global.api.user.organizations.OpenInvitation.get(req)                         | invitationid=       |            |
|global.api.user.organizations.OpenInvitationOrganization.get(req)             | invitationid=       |            |
|global.api.user.organizations.Organization.get(req)                           | organizationid=     |            |
|global.api.user.organizations.OrganizationInvitations.get(req)                | organizationid=     |            |
|global.api.user.organizations.OrganizationInvitationsCount.get(req)           | organizationid=     |            |
|global.api.user.organizations.OrganizationMembership.get(req)                 | organizationid=     |            |
|global.api.user.organizations.OrganizationMemberships.get(req)                | organizationid=     |            |
|global.api.user.organizations.OrganizationMembershipsCount.get(req)           | organizationid=     |            |
|global.api.user.organizations.Organizations.get(req)                          | accountid=          |            |
|global.api.user.organizations.OrganizationsCount.get(req)                     | accountid=          |            |
|global.api.user.organizations.SetOrganizationOwner.patch(req)                 | organizationid=     | accountid= |
|global.api.user.organizations.UpdateMembership.patch(req)                     | membershipid=       | name=&email= |
|global.api.user.organizations.UpdateOrganization.patch(req)                   | organizationid=     | name=&email= |

## Dashboard modules

Additional APIs, content and functionality can be added by `npm install` and nominating Dashboard modules in your `package.json`.  You can read more about this on the [Dashboard configuration wiki page](https://github.com/userdashboard/dashboard/wiki/Configuring-Dashboard)

    "dashboard": {
      "modules": [ "package", "package2" ]
    }

Modules can supplement the global.sitemap with additional routes which automatically maps them into the `Private API` shared as global.api.

| Name | Description | Package   | Repository |
|------|-------------|-----------|------------|
| MaxMind GeoIP | IP address-based geolocation | @userdashboard/maxmind-geoip | [github](https://github.com/userdashboard/maxmind-geoip) |
| Organizations | User created groups | @userdashboard/organizations | [github](https://github.com/userdashboard/organizations) |
| Stripe Subscriptions | SaaS functionality | @userdashboard/stripe-subscriptions | [github](https://github.com/userdashboard/stripe-subscriptions) |
| Stripe Connect | Marketplace functionality | @userdashboard/stripe-connect | [github](https://github.com/userdashboard/stripe-connect)

#### Development

Development takes place on [Github](https://github.com/userdashboard/organizations) with releases on [NPM](https://www.npmjs.com/package/@userdashboard/organizations).

#### License

This is free and unencumbered software released into the public domain.  The MIT License is provided for countries that have not established a public domain.