# node-meraki-dashboard
A node.js client library for using the Meraki Dashboard API.

### Info
* Official Documentation: https://dashboard.meraki.com/api_docs

## Example
### Using Promises (normal functions)
```javascript
var dashboard = require('node-meraki-dashboard')(key)
dashboard.organizations.list()
  .then(function(data) {
    console.log(data)
  })
  .catch(function(error) {
    console.log(error)
  });
```

### Using Promises (arrow functions)
```javascript
var dashboard = require('node-meraki-dashboard')(key)
dashboard.organizations.list()
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
var dashboard = require('node-meraki-dashboard')(key)

(async function() {
  try {
    var orgList = await dashboard.organizations.list();
    console.log(orgList);
  } catch (error) {
    console.log(error);
  }
})();
```

## Todo
* Add test files via tap
* Add code coverage via coveralls.io
* Add continuous integration via travis-ci
  * Include config file for travis
* Add actual documentation to README / source code