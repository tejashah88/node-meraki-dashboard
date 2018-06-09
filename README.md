# node-meraki-dashboard

![NPM Version](https://img.shields.io/npm/v/node-meraki-dashboard.svg)

A slightly opinionated node.js client library for using the Meraki Dashboard API.

## Documentation
* [Official Documentation](https://api.meraki.com/api_docs)
* [Postman Documentation](https://documenter.getpostman.com/view/897512/2To9xm) (usually more up-to-date)
* [Library docs](DOCUMENTATION.md)

## Getting started

#### Installing
```bash
npm install --save node-meraki-dashboard
```

#### Using Promises
```javascript
var dashboard = require('node-meraki-dashboard')(apiKey);
dashboard.organizations.list()
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

#### Using Async/Await
```javascript
var dashboard = require('node-meraki-dashboard')(apiKey);

(async function() {
  try {
    var orgList = await dashboard.organizations.list();
    console.log(orgList);
  } catch (error) {
    console.log(error);
  }
})();
```
