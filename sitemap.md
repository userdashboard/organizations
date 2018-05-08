# Dashboard sitemap
This site map is generated automatically each time the dashboard starts.

| URL | AUTH | LOCK | TEMPLATE | HTTP REQUESTS | NODEJS | HTML |
|-----|------|------|----------|---------------|--------|------|
|/|GUEST    |        |FULLSCREEN    |               |        |      
|/account|         |        |              |               |        |      
|/account/authorize|         |        |FULLSCREEN    |GET POST       |        |      
|/account/change-password|         |        |              |GET POST       |        |      
|/account/change-username|         |        |              |GET POST       |        |      
|/account/create-reset-code|         |        |              |GET POST       |        |      
|/account/delete-account|         |        |              |GET POST       |        |      
|/account/delete-account-complete|GUEST    |        |FULLSCREEN    |GET            |        |      
|/account/delete-reset-code|         |        |              |GET POST       |        |      
|/account/end-all-sessions|         |        |              |GET POST       |        |      
|/account/end-session|         |        |              |GET POST       |        |      
|/account/profile|         |        |              |GET POST       |        |      
|/account/register|GUEST    |        |FULLSCREEN    |GET POST       |        |      
|/account/reset-account|GUEST    |        |FULLSCREEN    |GET POST       |        |      
|/account/reset-codes|         |        |              |GET            |        |      
|/account/restore-account|GUEST    |        |FULLSCREEN    |GET POST       |        |      
|/account/sessions|         |        |              |GET            |        |      
|/account/signin|GUEST    |        |FULLSCREEN    |GET POST       |        |      
|/account/signout|         |        |FULLSCREEN    |GET            |        |      
|/account/signout-complete|GUEST    |        |FULLSCREEN    |               |        |      
|/administrator|         |        |              |               |        |      
|/administrator/account|         |        |              |GET            |        |      
|/administrator/accounts|         |        |              |GET            |        |      
|/administrator/administrators|         |        |              |GET            |        |      
|/administrator/assign-administrator|         |        |              |GET POST       |        |      
|/administrator/create-reset-code|         |        |              |GET POST       |        |      
|/administrator/delete-account|         |        |              |GET POST       |        |      
|/administrator/delete-schedule|         |        |              |GET            |        |      
|/administrator/reset-codes|         |        |              |GET            |        |      
|/administrator/reset-session-key|         |        |              |GET POST       |        |      
|/administrator/revoke-administrator|         |        |              |GET POST       |        |      
|/administrator/sessions|         |        |              |GET            |        |      
|/administrator/transfer-ownership|         |        |              |GET POST       |        |      
|/api/administrator/account|         |        |              |GET            |        |      
|/api/administrator/accounts|         |        |              |GET            |        |      
|/api/administrator/administrators|         |        |              |GET            |        |      
|/api/administrator/assign-administrator|         |LOCK    |              |PATCH          |        |      
|/api/administrator/create-reset-code|         |LOCK    |              |POST           |        |      
|/api/administrator/delete-account|         |LOCK    |              |DELETE         |        |      
|/api/administrator/delete-schedule|         |        |              |GET            |        |      
|/api/administrator/profile|         |        |              |GET            |        |      
|/api/administrator/reset-code|         |        |              |GET            |        |      
|/api/administrator/reset-codes|         |        |              |GET            |        |      
|/api/administrator/reset-session-key|         |LOCK    |              |PATCH          |        |      
|/api/administrator/revoke-administrator|         |LOCK    |              |DELETE         |        |      
|/api/administrator/session|         |        |              |GET            |        |      
|/api/administrator/sessions|         |        |              |GET            |        |      
|/api/administrator/transfer-ownership|         |LOCK    |              |PATCH          |        |      
|/api/user/account|         |        |              |GET            |        |      
|/api/user/authenticate|         |        |              |POST           |        |      
|/api/user/change-password|         |LOCK    |              |PATCH          |        |      
|/api/user/change-username|         |LOCK    |              |PATCH          |        |      
|/api/user/create-account|GUEST    |        |              |POST           |        |      
|/api/user/create-reset-code|         |LOCK    |              |POST           |        |      
|/api/user/delete-account|         |LOCK    |              |DELETE         |        |      
|/api/user/delete-reset-code|         |LOCK    |              |DELETE         |        |      
|/api/user/end-session|         |        |              |PATCH          |        |      
|/api/user/profile|         |        |              |GET            |        |      
|/api/user/proxy-account|         |        |              |GET            |        |      
|/api/user/proxy-profile|         |        |              |GET            |        |      
|/api/user/reset-account|GUEST    |        |              |PATCH          |        |      
|/api/user/reset-code|         |        |              |GET            |        |      
|/api/user/reset-codes|         |        |              |GET            |        |      
|/api/user/reset-session-key|         |LOCK    |              |PATCH          |        |      
|/api/user/restore-account|GUEST    |        |              |PATCH          |        |      
|/api/user/session|         |        |              |GET            |        |      
|/api/user/sessions|         |        |              |GET            |        |      
|/api/user/signin|GUEST    |        |              |POST           |        |      
|/api/user/signout|         |        |              |GET            |        |      
|/api/user/update-profile|         |LOCK    |              |PATCH          |        |      
|/home|         |        |              |               |        |      