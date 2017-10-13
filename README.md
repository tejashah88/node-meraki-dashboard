# node-meraki-dashboard
A node.js client library for using the Meraki Dashboard API.

Note: This library is untested, and there won't be any plans to add unit/integration testing anytime soon. If there are any bugs/issues, please make a new issue [here](https://github.com/tejashah88/node-meraki-dashboard/issues).

### Documentation/Usage
* Official Documentation: https://dashboard.meraki.com/api_docs

Structure of

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

## TODO
* Add actual documentation to README / source code