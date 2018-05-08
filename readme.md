# Dashboard User Organizations

This is a NodeJS project that accompanies a [Dashboard](https://github.com/userappstore/dashboard) project to provide organizations for users.

Organizations can be created by any user, and the owner may create invitation codes to give to people to join the organization.

Owners may transfer organizations, revoke memberships and update the organization name and email.

Users may be members of any organizations and delete their own membership at any time and update their membership email.

Email addresses are provided by users and organization owners as identifiers and for direct contact.  The email addresses do not get verified and are not required to be unique.

Administrator pages provide oversight of the organizations, memberships and invitations being created in your application.

This is free and unencumbered software released into the public domain.

## Install the module in your dashboard project

    $ npm install @userappstore/user-organizations
    
## Activate the module by including it in ENV configuration:

    global.env.DASHBOARD_MODULES = '@userappstore/user-organizations'

## Pass memberships or owned organizations to your application

API endpoints exist to bind memberships and organizations to the request headers so that they are forwarded to your application.  Organization and invitation information are bundled with memberships.

    /api/user/organizations/proxy-memberships
    /api/user/organizations/proxy-organizations

These API endpoints will run for each request if you add them to your `afterAuthentication` handlers in your `package.json`:

    "dashboard": {
      "afterAuthentication": [
        "node_modules/@userappstore/organizations/src/www/api/user/organizations/proxy-memberships.js",
        "node_modules/@userappstore/organizations/src/www/api/user/organizations/proxy-organizations.js"
      ]
    }

## Unit tests

Each NodeJS file for the APIs and Browser Interface have an accompanying .test.js file that run via `mocha`:

    $ npm test # shortcut
    $ mocha src/**/*.test.js --timeout 5000

