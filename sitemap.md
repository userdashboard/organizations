# Dashboard sitemap
This site map is generated automatically each time the dashboard starts.

| URL | AUTH | LOCK | TEMPLATE | HTTP REQUESTS | NODEJS | HTML |
|-----|------|------|----------|---------------|--------|------|
|/|GUEST    |        |FULLSCREEN    |               |static-page                    |@userappstore/dashboard    
|/account|         |        |              |               |static-page                    |@userappstore/dashboard    
|/account/authorize|         |        |FULLSCREEN    |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/change-password|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/change-username|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/create-reset-code|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/delete-account|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/delete-account-complete|GUEST    |        |FULLSCREEN    |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/account/delete-reset-code|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/end-all-sessions|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/end-session|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/organizations|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/accept-invitation|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/create-organization|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/delete-membership|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/edit-membership|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/membership|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/memberships|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/organization|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/create-invitation|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/owner/delete-invitation|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/owner/delete-organization|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/owner/edit-organization|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/owner/invitation|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/invitations|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/membership|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/memberships|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/organization|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/organizations|         |        |              |GET            |/src/www                       |/src/www                   
|/account/organizations/owner/revoke-membership|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/organizations/owner/transfer-organization|         |        |              |GET POST       |/src/www                       |/src/www                   
|/account/profile|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/register|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/reset-account|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/reset-codes|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/account/restore-account|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/sessions|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/account/signin|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/account/signout|         |        |FULLSCREEN    |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/account/signout-complete|GUEST    |        |FULLSCREEN    |               |static-page                    |@userappstore/dashboard    
|/administrator|         |        |              |               |static-page                    |@userappstore/dashboard    
|/administrator/account|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/accounts|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/administrators|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/assign-administrator|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/create-reset-code|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/delete-account|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/delete-schedule|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/organizations|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/invitation|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/invitations|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/membership|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/memberships|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/organization|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/organizations/organizations|         |        |              |GET            |/src/www                       |/src/www                   
|/administrator/reset-codes|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/reset-session-key|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/revoke-administrator|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/schedule-account-delete|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/sessions|         |        |              |GET            |@userappstore/dashboard        |@userappstore/dashboard    
|/administrator/transfer-ownership|         |        |              |GET POST       |@userappstore/dashboard        |@userappstore/dashboard    
|/api/administrator/account|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/accounts|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/administrators|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/assign-administrator|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/administrator/create-reset-code|         |LOCK    |              |POST           |@userappstore/dashboard        |                           
|/api/administrator/delete-account|         |LOCK    |              |DELETE         |@userappstore/dashboard        |                           
|/api/administrator/delete-schedule|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/organizations/invitation|         |        |              |GET            |/src/www                       |                           
|/api/administrator/organizations/invitations|         |        |              |GET            |/src/www                       |                           
|/api/administrator/organizations/membership|         |        |              |GET            |/src/www                       |                           
|/api/administrator/organizations/memberships|         |        |              |GET            |/src/www                       |                           
|/api/administrator/organizations/organization|         |        |              |GET            |/src/www                       |                           
|/api/administrator/organizations/organizations|         |        |              |GET            |/src/www                       |                           
|/api/administrator/profile|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/reset-code|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/reset-codes|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/reset-session-key|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/administrator/revoke-administrator|         |LOCK    |              |DELETE         |@userappstore/dashboard        |                           
|/api/administrator/schedule-account-delete|         |LOCK    |              |DELETE         |@userappstore/dashboard        |                           
|/api/administrator/session|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/sessions|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/administrator/transfer-ownership|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/account|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/authenticate|         |        |              |POST           |@userappstore/dashboard        |                           
|/api/user/change-password|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/change-username|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/create-account|GUEST    |        |              |POST           |@userappstore/dashboard        |                           
|/api/user/create-reset-code|         |LOCK    |              |POST           |@userappstore/dashboard        |                           
|/api/user/delete-account|         |LOCK    |              |DELETE         |@userappstore/dashboard        |                           
|/api/user/delete-reset-code|         |LOCK    |              |DELETE         |@userappstore/dashboard        |                           
|/api/user/end-session|         |        |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/maxmind/country|GUEST    |        |              |GET            |@userappstore/maxmind-geoip    |                           
|/api/user/organizations/accept-invitation|         |LOCK    |              |PATCH          |/src/www                       |                           
|/api/user/organizations/account-memberships|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/create-invitation|         |LOCK    |              |POST           |/src/www                       |                           
|/api/user/organizations/create-organization|         |LOCK    |              |POST           |/src/www                       |                           
|/api/user/organizations/delete-invitation|         |LOCK    |              |DELETE         |/src/www                       |                           
|/api/user/organizations/delete-membership|         |LOCK    |              |DELETE         |/src/www                       |                           
|/api/user/organizations/delete-organization|         |LOCK    |              |DELETE         |/src/www                       |                           
|/api/user/organizations/invitation|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/invitations|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/membership|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/memberships|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/organization|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/organizations|         |        |              |GET            |/src/www                       |                           
|/api/user/organizations/transfer-organization|         |LOCK    |              |PATCH          |/src/www                       |                           
|/api/user/organizations/update-membership|         |LOCK    |              |PATCH          |/src/www                       |                           
|/api/user/organizations/update-organization|         |LOCK    |              |PATCH          |/src/www                       |                           
|/api/user/profile|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/proxy-account|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/proxy-profile|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/reset-account|GUEST    |        |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/reset-code|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/reset-codes|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/reset-session-key|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/restore-account|GUEST    |        |              |PATCH          |@userappstore/dashboard        |                           
|/api/user/session|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/sessions|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/signin|GUEST    |        |              |POST           |@userappstore/dashboard        |                           
|/api/user/signout|         |        |              |GET            |@userappstore/dashboard        |                           
|/api/user/update-profile|         |LOCK    |              |PATCH          |@userappstore/dashboard        |                           
|/home|         |        |              |               |static-page                    |@userappstore/dashboard    