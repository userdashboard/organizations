# Organizations for Dashboard

This module adds a complete user and administrator `Private API` and `Web UI` for user organizations.

# Dashboard
Dashboard is a NodeJS project that provides a user account system and administration tools for web applications.  A traditional web application has a tailor-made user login and management system often grievously lacking in functionality that will be added later, or forfeits very priviliged information to Google and Facebook.  When you use Dashboard you start with a complete UI for your users and administrators to manage the beaurocacy of web apps. 

You can use your preferred language, database and tools to write your application with Dashboard hosted seperately.  Dashboard will proxy your content as the user requests it, and your server can access Dashboard's comprehensive API to retrieve account-related data.

NodeJS developers may embed Dashboard as a module `@userappstore/dashboard` and share the hosting, or host Dashboard seperately too

### Demonstrations

- [Dashboard](https://dashboard-demo-2344.herokuapp.com)
- [Dashboard + Organizations module](https://organizations-demo-7933.herokuapp.com)
- [Dashboard + Stripe Subscriptions module](https://stripe-subscriptions-5701.herokuapp.com)
- [Dashboard + Stripe Connect module](https://stripe-connect-8509.herokuapp.com)

### UserAppStore

If you are building a SaaS with Dashboard consider publishing it on [UserAppStore](https://userappstore.com), an app store for subscriptions.   UserAppStore is powered by Dashboard and open source too.

#### Dashboard documentation
- [Introduction](https://github.com/userappstore/dashboard/wiki)
- [Configuring Dashboard](https://github.com/userappstore/dashboard/wiki/Configuring-Dashboard)
- [Contributing to Dashboard](https://github.com/userappstore/dashboard/wiki/Contributing-to-Dashboard)
- [Dashboard code structure](https://github.com/userappstore/dashboard/wiki/Dashboard-code-structure)
- [Server request lifecycle](https://github.com/userappstore/dashboard/wiki/Server-Request-Lifecycle)

#### License

This is free and unencumbered software released into the public domain.  The MIT License is provided for countries that have not established a public domain.

## Installation

You must install [Redis](https://redis.io) and [NodeJS](https://nodejs.org) 8.1.4+ prior to these steps.

    $ mkdir project
    $ cd project
    $ npm init
    $ npm install @userappstore/dashboard
    $ npm install @userappstore/organizations
    # create a main.js
    $ node main.js

Your `main.js` should contain:

    const dashboard = require('./index.js')
    dashboard.start(__dirname)

Add this code to require the module in your `package.json`:

    "dashboard": {
      "dashboard-modules": [
        "@userappstore/organizations"
      ]
    }

Your sitemap will output the server address, by default you can access it at:

    http://localhost:8000

The first account to register will be the owner and an administrator.

## Pass memberships or owned organizations to your application

Server handlers exist to bind memberships and organizations to the request headers so that they are forwarded to your application.  Organization and invitation information are bundled with memberships.

    /src/server/proxy-memberships
    /src/server/proxy-organizations

When used as a module their paths will be:

    /node_modules/@userappstore/organizations/src/server/proxy-memberships
    /node_modules/@userappstore/organizations/src/server/proxy-organizations

These API endpoints will run for each request if you add them to your `server` handlers in your `package.json`:

    "dashboard": {
      "server": [
        "node_modules/@userappstore/organizations/src/www/api/user/organizations/proxy-memberships.js",
        "node_modules/@userappstore/organizations/src/www/api/user/organizations/proxy-organizations.js"
      ]
    }

