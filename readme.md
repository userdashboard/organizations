# Organizations for Dashboard
Dashboard is a NodeJS project that accompanies a web app you build and provides a complete account system for your users and administration tools.  Dashboard divides your application into two components: a header with account and administrative menus and navigation bar; and a frame for serving content.

The content can come from Dashboard, Dashboard modules, content you added to Dashboard, or an app you built in any other language hosted separately.

This module adds a complete user and administrator `Private API` and `Web UI` for basic user organizations.

#### Dashboard documentation
- [Introduction](https://github.com/userappstore/dashboard/wiki)
- [Configuring Dashboard](https://github.com/userappstore/dashboard/wiki/Configuring-Dashboard)
- [Contributing to Dashboard](https://github.com/userappstore/dashboard/wiki/Contributing-to-Dashboard)
- [Dashboard code structure](https://github.com/userappstore/dashboard/wiki/Dashboard-code-structure)
- [Server request lifecycle](https://github.com/userappstore/dashboard/wiki/Server-Request-Lifecycle)

#### License

This is free and unencumbered software released into the public domain.  The MIT License is provided for countries that have not established a public domain.

## Installation 

    $ mkdir project
    $ cd project
    $ npm init
    $ npm install @userappstore/dashboard
    $ npm install @userappstore/organizations
    # create a  main.js
    $ node main.js

Your main.js should contain:

    const dashboard = require('./index.js')
    dashboard.start(__dirname)

Your package.json should contain:

    "dashboard": {
      "dashboard-modules": [
        "@userappstore/organizations"
      ]
    }

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
