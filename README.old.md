# node-meraki-dashboard

[![NPM Version](https://img.shields.io/npm/v/node-meraki-dashboard.svg)](https://www.npmjs.com/package/node-meraki-dashboard)
[![Build Status](https://travis-ci.org/tejashah88/node-meraki-dashboard.svg?branch=master)](https://travis-ci.org/tejashah88/node-meraki-dashboard)

A ~~modern~~ **now outdated** node.js client library for using the Meraki Dashboard API (v0). Supports a minimum of node v6.

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

### API coverage tool

The API coverage tool is used for reporting endpoints that are not implemented by this library. It fetches the endpoints from the official documentation and checks against the current codebase and finally generates a fancy table of the missing endpoints needed.

#### Usage

```bash
npm run api-coverage
```
