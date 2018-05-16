# Dashboard sitemap
This site map is generated automatically each time the dashboard starts.

| URL | AUTH | LOCK | TEMPLATE | HTTP REQUESTS | NODEJS | HTML |
|-----|------|------|----------|---------------|--------|------|
|/|GUEST    |        |FULLSCREEN    |               |STATIC PAGE                |@userappstore/dashboard    
|/account|         |        |              |               |STATIC PAGE                |@userappstore/dashboard    
|/account/authorize|         |        |FULLSCREEN    |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/change-password|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/change-username|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/create-reset-code|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/delete-account|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/delete-account-complete|GUEST    |        |FULLSCREEN    |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/account/delete-reset-code|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/end-all-sessions|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/end-session|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/organizations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/accept-invitation|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/create-organization|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/delete-membership|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/edit-membership|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/membership|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/memberships|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/organization|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/create-invitation|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/delete-invitation|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/delete-organization|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/edit-organization|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/invitation|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/invitations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/membership|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/memberships|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/organization|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/organizations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/revoke-membership|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/organizations/owner/transfer-organization|         |        |              |GET POST       |ROOT FILE                  |ROOT FILE                  
|/account/profile|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/register|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/reset-account|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/reset-codes|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/account/restore-account|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/sessions|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/account/signin|GUEST    |        |FULLSCREEN    |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/account/signout|         |        |FULLSCREEN    |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/account/signout-complete|GUEST    |        |FULLSCREEN    |               |STATIC PAGE                |@userappstore/dashboard    
|/administrator|         |        |              |               |STATIC PAGE                |@userappstore/dashboard    
|/administrator/account|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/accounts|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/administrators|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/assign-administrator|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/create-reset-code|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/delete-account|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/delete-schedule|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/organizations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/invitation|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/invitations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/membership|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/memberships|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/organization|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/organizations/organizations|         |        |              |GET            |ROOT FILE                  |ROOT FILE                  
|/administrator/reset-codes|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/reset-session-key|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/revoke-administrator|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/schedule-account-delete|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/sessions|         |        |              |GET            |@userappstore/dashboard    |@userappstore/dashboard    
|/administrator/transfer-ownership|         |        |              |GET POST       |@userappstore/dashboard    |@userappstore/dashboard    
|/api/administrator/account|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/accounts|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/administrators|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/assign-administrator|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/administrator/create-reset-code|         |LOCK    |              |POST           |@userappstore/dashboard    |                           
|/api/administrator/delete-account|         |LOCK    |              |DELETE         |@userappstore/dashboard    |                           
|/api/administrator/delete-schedule|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/organizations/invitation|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/organizations/invitations|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/organizations/membership|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/organizations/memberships|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/organizations/organization|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/organizations/organizations|         |        |              |GET            |ROOT FILE                  |                           
|/api/administrator/profile|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/reset-code|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/reset-codes|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/reset-session-key|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/administrator/revoke-administrator|         |LOCK    |              |DELETE         |@userappstore/dashboard    |                           
|/api/administrator/schedule-account-delete|         |LOCK    |              |DELETE         |@userappstore/dashboard    |                           
|/api/administrator/session|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/sessions|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/administrator/transfer-ownership|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/account|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/authenticate|         |        |              |POST           |@userappstore/dashboard    |                           
|/api/user/change-password|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/change-username|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/create-account|GUEST    |        |              |POST           |@userappstore/dashboard    |                           
|/api/user/create-reset-code|         |LOCK    |              |POST           |@userappstore/dashboard    |                           
|/api/user/delete-account|         |LOCK    |              |DELETE         |@userappstore/dashboard    |                           
|/api/user/delete-reset-code|         |LOCK    |              |DELETE         |@userappstore/dashboard    |                           
|/api/user/end-session|         |        |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/organizations/accept-invitation|         |LOCK    |              |PATCH          |ROOT FILE                  |                           
|/api/user/organizations/account-memberships|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/create-invitation|         |LOCK    |              |POST           |ROOT FILE                  |                           
|/api/user/organizations/create-organization|         |LOCK    |              |POST           |ROOT FILE                  |                           
|/api/user/organizations/delete-invitation|         |LOCK    |              |DELETE         |ROOT FILE                  |                           
|/api/user/organizations/delete-membership|         |LOCK    |              |DELETE         |ROOT FILE                  |                           
|/api/user/organizations/delete-organization|         |LOCK    |              |DELETE         |ROOT FILE                  |                           
|/api/user/organizations/invitation|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/invitations|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/membership|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/memberships|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/organization|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/organizations|         |        |              |GET            |ROOT FILE                  |                           
|/api/user/organizations/transfer-organization|         |LOCK    |              |PATCH          |ROOT FILE                  |                           
|/api/user/organizations/update-membership|         |LOCK    |              |PATCH          |ROOT FILE                  |                           
|/api/user/organizations/update-organization|         |LOCK    |              |PATCH          |ROOT FILE                  |                           
|/api/user/profile|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/reset-account|GUEST    |        |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/reset-code|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/reset-codes|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/reset-session-key|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/restore-account|GUEST    |        |              |PATCH          |@userappstore/dashboard    |                           
|/api/user/session|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/sessions|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/signin|GUEST    |        |              |POST           |@userappstore/dashboard    |                           
|/api/user/signout|         |        |              |GET            |@userappstore/dashboard    |                           
|/api/user/update-profile|         |LOCK    |              |PATCH          |@userappstore/dashboard    |                           
|/home|         |        |              |               |STATIC PAGE                |@userappstore/dashboard    