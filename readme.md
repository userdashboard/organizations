# Organizations module for Dashboard
![Test suite status](https://github.com/userdashboard/organizations/workflows/test-and-publish/badge.svg?branch=master)

Dashboard bundles everything a web app needs, all the "boilerplate" like signing in and changing passwords, into a parallel server so you can write a much smaller web app.

The organizations module allows users to create organizations and invitations other users can accept to join.  Users must share the invitations themselves with the recipients.

Your application server can use the Organizations module's API to fetch what organizations a user is in and use that data to allow shared access or assign ownership or whatever other purpose.

A complete UI is provided for users to create and manage their organizations and memberships, and a basic administrator UI is provided for oversight but has no actual functionality yet.

Environment configuration variables are documented in `start-dev.sh`.  You can view API documentation in `api.txt`, or in more detail on the [documentation site](https://userdashboard.github.io/).  Join the freenode IRC #userdashboard chatroom for support - [Web IRC client](https://kiwiirc.com/nextclient/).

## Import this module

On your Dashboard server you need to install this module with NPM:

    $ npm install @userdashboard/organizations

Edit your `package.json` to activate the module:

    "dashboard": {
      "modules": [
        "@userdashboard/organizations"
      ]
    }

## Storage engine

By default this module will share whatever storage you use for Dashboard.  You can specify a Dashboard storage module to use instead.

        ORGANIZATIONS_STORAGE=@userdashboard/storage-mongodb
        ORGANIZATIONS_MONGODB_URL=mongo://localhost:27017/organizations

# Customizing membership profiles

Memberships designate a Profile which you can configure to collect the information relevant to your organizations.  You specify the fields you want in an environment variable:

    MEMBERSHIP_PROFILE_FIELDS="any,of,the,below"

| Field          | 
|----------------|
| display-name   |
| display-email  |
| contact-email  |
| full-name      |
| dob            |
| phone          |
| occupation     |
| location       |
| location       |     
| company-name   |
| website        |

## Supporting your users

Every page in Dashboard and official modules has a series of screenshots that demonstrate how to browse to the page and optionally what the page does.  If a user wants to change their password or cancel a subscription or submit a Connect registration, you can browse the screenshots on the [documentation site](https://userdashboard.github.io/).

### Request organization data from your application server

Dashboard and official modules are completely API-driven and you can access the same APIs on behalf of the user making requests.  You perform `GET`, `POST`, `PATCH`, and `DELETE` HTTP requests against the API endpoints to fetch or modify data.  This example uses NodeJS to fetch the user's organizations from the Dashboard server, your application server can be in any language.

You can view API documentation within the NodeJS modules' `api.txt` files, or on the [documentation site](https://userdashboard.github.io/organizations-api).

        const requestOptions = {
            host: 'dashboard.example.com',
            path: `/api/user/organizations/memberships?accountid=${accountid}`,
            port: '443',
            method: 'GET',
            headers: {
                'x-application-server': 'application.example.com',
                'x-application-server-token': process.env.APPLICATION_SERVER_TOKEN
            }
        }
        if (accountid) {
            requestOptions.headers['x-accountid'] = accountid
            requestOptions.headers['x-sessionid'] = sessionid
        }
        const membershipsArray = await proxy(requestOptions)

        function proxy = util.promisify((requestOptions, callback) => {
          const proxyRequest = require('https').request(requestOptions, (proxyResponse) => {
              let body = ''
              proxyResponse.on('data', (chunk) => {
                  body += chunk
              })
              return proxyResponse.on('end', () => {
                  return callback(null, JSON.parse(body))
              })
          })
          proxyRequest.on('error', (error) => {
              return callback(error)
          })
          return proxyRequest.end()
        })
