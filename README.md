# node-meraki-dashboard

[![NPM Version](https://img.shields.io/npm/v/node-meraki-dashboard.svg)](https://www.npmjs.com/package/node-meraki-dashboard)
[![Build Status](https://travis-ci.org/tejashah88/node-meraki-dashboard.svg?branch=master)](https://travis-ci.org/tejashah88/node-meraki-dashboard)
[![Coverage Status](https://coveralls.io/repos/github/tejashah88/node-meraki-dashboard/badge.svg)](https://coveralls.io/github/tejashah88/node-meraki-dashboard)
[![dependencies Status](https://david-dm.org/tejashah88/node-meraki-dashboard/status.svg)](https://david-dm.org/tejashah88/node-meraki-dashboard)

A modern node.js client library for using the Meraki Dashboard API. Supports a minimum of node v6+.

### :warning: **Announcement - December 22nd, 2018** :warning:
I've been noticing that Meraki has added a significant amount of new endpoints over the course of 6 months (about 75 since the last release of this library). This has made it difficult to keep up with the recent additions and track which changes they've made, and their changelogs don't appear to tell the entire story.

To ensure the longevity of this library, I've make a few significant (non-breaking) updates to how this library will work.

1. I've added some new functions in v2.0.0 that allow you to make custom API calls for any endpoints that haven't been implemented, which will be under the `dashboard.custom` section. This should help when there's newly released endpoints that haven't been implemented yet.
2. I've started to add basic unit testing of the library as well as an experimental API coverage tool that reports which endpoints are covered by this library. This tool will pull all documented endpoints from the official docs and the Postman collection, compare it with endpoints that are implemented, and output which endpoints need to be implemented. This is separate from the integrated code coverage, and as such, will not be part of the rest of the tests.

## Documentation

* [Official Documentation](https://api.meraki.com/api_docs)
* [Postman Documentation](https://documenter.getpostman.com/view/897512/2To9xm)
* [Library docs](DOCUMENTATION.md)

## Getting started

### Installing
```bash
npm install --save node-meraki-dashboard
```

### Using Promises
```javascript
const dashboard = require('node-meraki-dashboard')(apiKey);
dashboard.organizations.list()
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
const dashboard = require('node-meraki-dashboard')(apiKey);

(async function() {
  try {
    const orgList = await dashboard.organizations.list();
    console.log(orgList);
  } catch (error) {
    console.log(error);
  }
})();
```

## Development / Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) guide for getting started with making modifications to this library.

### Setup & Testing
```bash
git clone https://github.com/tejashah88/node-meraki-dashboard.git
cd node-meraki-dashboard
npm install
npm test
```

### Running the API coverage tool

**Disclaimer**: You should take any unimplemented endpoints coming from Postman with a grain of salt, as some parts of it aren't as consistent as the official docs. This can make the API coverage tool report false endpoints that are actually implemented but are invalid due to how the Postman collection is defined.

With that being said, there is a blacklist that can be used to filter those false endpoints, which you can use and generate with passing a few arguments below.

```bash
npm run api-coverage -- --disable-blacklist --save-blacklist
```

* `disable-blacklist` - disables reading from the blacklist
* `save-blacklist` - saves or overwrites the current blacklist with the current analysis

You can omit either or both arguments to suite your needs.