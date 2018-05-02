# Dashboard sitemap
This site map is generated automatically each time the dashboard starts.

| URL | AUTH | TEMPLATE | HTTP REQUESTS | NODEJS | HTML |
|-----|------|----------|---------------|--------|------|
|/|GUEST |FULLSCREEN  |               ||/node_modules/@userappstore/dashboard/src/www/index.html|
|/account|      |            |               ||/node_modules/@userappstore/dashboard/src/www/account/index.html|
|/account/authorize|      |FULLSCREEN  |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/authorize.js|/node_modules/@userappstore/dashboard/src/www/account/authorize.html|
|/account/change-password|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/change-password.js|/node_modules/@userappstore/dashboard/src/www/account/change-password.html|
|/account/change-username|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/change-username.js|/node_modules/@userappstore/dashboard/src/www/account/change-username.html|
|/account/create-reset-code|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/create-reset-code.js|/node_modules/@userappstore/dashboard/src/www/account/create-reset-code.html|
|/account/delete-account|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/delete-account.js|/node_modules/@userappstore/dashboard/src/www/account/delete-account.html|
|/account/delete-account-complete|GUEST |FULLSCREEN  |GET            |/node_modules/@userappstore/dashboard/src/www/account/delete-account-complete.js|/node_modules/@userappstore/dashboard/src/www/account/delete-account-complete.html|
|/account/delete-reset-code|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/delete-reset-code.js|/node_modules/@userappstore/dashboard/src/www/account/delete-reset-code.html|
|/account/end-all-sessions|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/end-all-sessions.js|/node_modules/@userappstore/dashboard/src/www/account/end-all-sessions.html|
|/account/end-session|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/end-session.js|/node_modules/@userappstore/dashboard/src/www/account/end-session.html|
|/account/organizations|      |            |GET            |/src/www/account/organizations/index.js|/src/www/account/organizations/index.html|
|/account/organizations/accept-invitation|      |            |GET POST       |/src/www/account/organizations/accept-invitation.js|/src/www/account/organizations/accept-invitation.html|
|/account/organizations/create-organization|      |            |GET POST       |/src/www/account/organizations/create-organization.js|/src/www/account/organizations/create-organization.html|
|/account/organizations/delete-membership|      |            |GET POST       |/src/www/account/organizations/delete-membership.js|/src/www/account/organizations/delete-membership.html|
|/account/organizations/edit-membership|      |            |GET POST       |/src/www/account/organizations/edit-membership.js|/src/www/account/organizations/edit-membership.html|
|/account/organizations/membership|      |            |GET            |/src/www/account/organizations/membership.js|/src/www/account/organizations/membership.html|
|/account/organizations/memberships|      |            |GET            |/src/www/account/organizations/memberships.js|/src/www/account/organizations/memberships.html|
|/account/organizations/organization|      |            |GET            |/src/www/account/organizations/organization.js|/src/www/account/organizations/organization.html|
|/account/organizations/owner/create-invitation|      |            |GET POST       |/src/www/account/organizations/owner/create-invitation.js|/src/www/account/organizations/owner/create-invitation.html|
|/account/organizations/owner/delete-invitation|      |            |GET POST       |/src/www/account/organizations/owner/delete-invitation.js|/src/www/account/organizations/owner/delete-invitation.html|
|/account/organizations/owner/delete-organization|      |            |GET POST       |/src/www/account/organizations/owner/delete-organization.js|/src/www/account/organizations/owner/delete-organization.html|
|/account/organizations/owner/edit-organization|      |            |GET POST       |/src/www/account/organizations/owner/edit-organization.js|/src/www/account/organizations/owner/edit-organization.html|
|/account/organizations/owner/invitation|      |            |GET            |/src/www/account/organizations/owner/invitation.js|/src/www/account/organizations/owner/invitation.html|
|/account/organizations/owner/invitations|      |            |GET            |/src/www/account/organizations/owner/invitations.js|/src/www/account/organizations/owner/invitations.html|
|/account/organizations/owner/membership|      |            |GET            |/src/www/account/organizations/owner/membership.js|/src/www/account/organizations/owner/membership.html|
|/account/organizations/owner/memberships|      |            |GET            |/src/www/account/organizations/owner/memberships.js|/src/www/account/organizations/owner/memberships.html|
|/account/organizations/owner/organization|      |            |GET            |/src/www/account/organizations/owner/organization.js|/src/www/account/organizations/owner/organization.html|
|/account/organizations/owner/organizations|      |            |GET            |/src/www/account/organizations/owner/organizations.js|/src/www/account/organizations/owner/organizations.html|
|/account/organizations/owner/revoke-membership|      |            |GET POST       |/src/www/account/organizations/owner/revoke-membership.js|/src/www/account/organizations/owner/revoke-membership.html|
|/account/organizations/owner/transfer-organization|      |            |GET POST       |/src/www/account/organizations/owner/transfer-organization.js|/src/www/account/organizations/owner/transfer-organization.html|
|/account/profile|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/profile.js|/node_modules/@userappstore/dashboard/src/www/account/profile.html|
|/account/register|GUEST |FULLSCREEN  |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/register.js|/node_modules/@userappstore/dashboard/src/www/account/register.html|
|/account/reset-account|GUEST |FULLSCREEN  |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/reset-account.js|/node_modules/@userappstore/dashboard/src/www/account/reset-account.html|
|/account/reset-codes|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/account/reset-codes.js|/node_modules/@userappstore/dashboard/src/www/account/reset-codes.html|
|/account/restore-account|GUEST |FULLSCREEN  |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/restore-account.js|/node_modules/@userappstore/dashboard/src/www/account/restore-account.html|
|/account/sessions|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/account/sessions.js|/node_modules/@userappstore/dashboard/src/www/account/sessions.html|
|/account/signin|GUEST |FULLSCREEN  |GET POST       |/node_modules/@userappstore/dashboard/src/www/account/signin.js|/node_modules/@userappstore/dashboard/src/www/account/signin.html|
|/account/signout|      |FULLSCREEN  |GET            |/node_modules/@userappstore/dashboard/src/www/account/signout.js|/node_modules/@userappstore/dashboard/src/www/account/signout.html|
|/account/signout-complete|GUEST |FULLSCREEN  |               ||/node_modules/@userappstore/dashboard/src/www/account/signout-complete.html|
|/administrator|      |            |               ||/node_modules/@userappstore/dashboard/src/www/administrator/index.html|
|/administrator/account|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/account.js|/node_modules/@userappstore/dashboard/src/www/administrator/account.html|
|/administrator/accounts|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/accounts.js|/node_modules/@userappstore/dashboard/src/www/administrator/accounts.html|
|/administrator/administrators|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/administrators.js|/node_modules/@userappstore/dashboard/src/www/administrator/administrators.html|
|/administrator/assign-administrator|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/assign-administrator.js|/node_modules/@userappstore/dashboard/src/www/administrator/assign-administrator.html|
|/administrator/create-reset-code|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/create-reset-code.js|/node_modules/@userappstore/dashboard/src/www/administrator/create-reset-code.html|
|/administrator/delete-account|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/delete-account.js|/node_modules/@userappstore/dashboard/src/www/administrator/delete-account.html|
|/administrator/delete-schedule|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/delete-schedule.js|/node_modules/@userappstore/dashboard/src/www/administrator/delete-schedule.html|
|/administrator/organizations|      |            |GET            |/src/www/administrator/organizations/index.js|/src/www/administrator/organizations/index.html|
|/administrator/organizations/invitation|      |            |GET            |/src/www/administrator/organizations/invitation.js|/src/www/administrator/organizations/invitation.html|
|/administrator/organizations/invitations|      |            |GET            |/src/www/administrator/organizations/invitations.js|/src/www/administrator/organizations/invitations.html|
|/administrator/organizations/membership|      |            |GET            |/src/www/administrator/organizations/membership.js|/src/www/administrator/organizations/membership.html|
|/administrator/organizations/memberships|      |            |GET            |/src/www/administrator/organizations/memberships.js|/src/www/administrator/organizations/memberships.html|
|/administrator/organizations/organization|      |            |GET            |/src/www/administrator/organizations/organization.js|/src/www/administrator/organizations/organization.html|
|/administrator/organizations/organizations|      |            |GET            |/src/www/administrator/organizations/organizations.js|/src/www/administrator/organizations/organizations.html|
|/administrator/reset-codes|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/reset-codes.js|/node_modules/@userappstore/dashboard/src/www/administrator/reset-codes.html|
|/administrator/reset-session-key|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/reset-session-key.js|/node_modules/@userappstore/dashboard/src/www/administrator/reset-session-key.html|
|/administrator/revoke-administrator|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/revoke-administrator.js|/node_modules/@userappstore/dashboard/src/www/administrator/revoke-administrator.html|
|/administrator/sessions|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/administrator/sessions.js|/node_modules/@userappstore/dashboard/src/www/administrator/sessions.html|
|/administrator/transfer-ownership|      |            |GET POST       |/node_modules/@userappstore/dashboard/src/www/administrator/transfer-ownership.js|/node_modules/@userappstore/dashboard/src/www/administrator/transfer-ownership.html|
|/api/administrator/account|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/account.js||
|/api/administrator/accounts|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/accounts.js||
|/api/administrator/administrators|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/administrators.js||
|/api/administrator/assign-administrator|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/administrator/assign-administrator.js||
|/api/administrator/create-reset-code|      |            |POST           |/node_modules/@userappstore/dashboard/src/www/api/administrator/create-reset-code.js||
|/api/administrator/delete-account|      |            |DELETE         |/node_modules/@userappstore/dashboard/src/www/api/administrator/delete-account.js||
|/api/administrator/delete-schedule|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/delete-schedule.js||
|/api/administrator/organizations/invitation|      |            |GET            |/src/www/api/administrator/organizations/invitation.js||
|/api/administrator/organizations/invitations|      |            |GET            |/src/www/api/administrator/organizations/invitations.js||
|/api/administrator/organizations/membership|      |            |GET            |/src/www/api/administrator/organizations/membership.js||
|/api/administrator/organizations/memberships|      |            |GET            |/src/www/api/administrator/organizations/memberships.js||
|/api/administrator/organizations/organization|      |            |GET            |/src/www/api/administrator/organizations/organization.js||
|/api/administrator/organizations/organizations|      |            |GET            |/src/www/api/administrator/organizations/organizations.js||
|/api/administrator/profile|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/profile.js||
|/api/administrator/reset-code|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/reset-code.js||
|/api/administrator/reset-codes|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/reset-codes.js||
|/api/administrator/reset-session-key|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/administrator/reset-session-key.js||
|/api/administrator/revoke-administrator|      |            |DELETE         |/node_modules/@userappstore/dashboard/src/www/api/administrator/revoke-administrator.js||
|/api/administrator/session|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/session.js||
|/api/administrator/sessions|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/administrator/sessions.js||
|/api/administrator/transfer-ownership|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/administrator/transfer-ownership.js||
|/api/user/account|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/account.js||
|/api/user/authenticate|      |            |POST           |/node_modules/@userappstore/dashboard/src/www/api/user/authenticate.js||
|/api/user/change-password|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/change-password.js||
|/api/user/change-username|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/change-username.js||
|/api/user/create-account|GUEST |            |POST           |/node_modules/@userappstore/dashboard/src/www/api/user/create-account.js||
|/api/user/create-reset-code|      |            |POST           |/node_modules/@userappstore/dashboard/src/www/api/user/create-reset-code.js||
|/api/user/delete-account|      |            |DELETE         |/node_modules/@userappstore/dashboard/src/www/api/user/delete-account.js||
|/api/user/delete-reset-code|      |            |DELETE         |/node_modules/@userappstore/dashboard/src/www/api/user/delete-reset-code.js||
|/api/user/end-session|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/end-session.js||
|/api/user/organizations/accept-invitation|      |            |PATCH          |/src/www/api/user/organizations/accept-invitation.js||
|/api/user/organizations/account-memberships|      |            |GET            |/src/www/api/user/organizations/account-memberships.js||
|/api/user/organizations/create-invitation|      |            |POST           |/src/www/api/user/organizations/create-invitation.js||
|/api/user/organizations/create-organization|      |            |POST           |/src/www/api/user/organizations/create-organization.js||
|/api/user/organizations/delete-invitation|      |            |DELETE         |/src/www/api/user/organizations/delete-invitation.js||
|/api/user/organizations/delete-membership|      |            |DELETE         |/src/www/api/user/organizations/delete-membership.js||
|/api/user/organizations/delete-organization|      |            |DELETE         |/src/www/api/user/organizations/delete-organization.js||
|/api/user/organizations/invitation|      |            |GET            |/src/www/api/user/organizations/invitation.js||
|/api/user/organizations/invitations|      |            |GET            |/src/www/api/user/organizations/invitations.js||
|/api/user/organizations/membership|      |            |GET            |/src/www/api/user/organizations/membership.js||
|/api/user/organizations/memberships|      |            |GET            |/src/www/api/user/organizations/memberships.js||
|/api/user/organizations/organization|      |            |GET            |/src/www/api/user/organizations/organization.js||
|/api/user/organizations/organizations|      |            |GET            |/src/www/api/user/organizations/organizations.js||
|/api/user/organizations/proxy-memberships|      |            |GET            |/src/www/api/user/organizations/proxy-memberships.js||
|/api/user/organizations/proxy-organizations|      |            |GET            |/src/www/api/user/organizations/proxy-organizations.js||
|/api/user/organizations/transfer-organization|      |            |PATCH          |/src/www/api/user/organizations/transfer-organization.js||
|/api/user/organizations/update-membership|      |            |PATCH          |/src/www/api/user/organizations/update-membership.js||
|/api/user/organizations/update-organization|      |            |PATCH          |/src/www/api/user/organizations/update-organization.js||
|/api/user/profile|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/profile.js||
|/api/user/proxy-account|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/proxy-account.js||
|/api/user/proxy-profile|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/proxy-profile.js||
|/api/user/reset-account|GUEST |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/reset-account.js||
|/api/user/reset-code|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/reset-code.js||
|/api/user/reset-codes|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/reset-codes.js||
|/api/user/reset-session-key|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/reset-session-key.js||
|/api/user/restore-account|GUEST |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/restore-account.js||
|/api/user/session|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/session.js||
|/api/user/sessions|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/sessions.js||
|/api/user/signin|GUEST |            |POST           |/node_modules/@userappstore/dashboard/src/www/api/user/signin.js||
|/api/user/signout|      |            |GET            |/node_modules/@userappstore/dashboard/src/www/api/user/signout.js||
|/api/user/update-profile|      |            |PATCH          |/node_modules/@userappstore/dashboard/src/www/api/user/update-profile.js||
|/home|      |            |               ||/node_modules/@userappstore/dashboard/src/www/home.html|