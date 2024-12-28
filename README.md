# node-meraki-dashboard

A ~~modern~~ **now outdated** node.js client library for using the Meraki Dashboard API (v0). See the deprecation notice below.

# :warning: Deprecation Notice :warning:

This library has aged poorly, having been created in 2019 when I was working with Cisco Meraki products for a hackathon at the time. The Dashboard API has evolved significantly since, with v1 being released since 2020 and [superseding v0 since February 5th, 2022](https://developer.cisco.com/meraki/api-v1/versioning/#v0-deprecation--sunset). Additionally, as of December 2024 (v1.53.0 of their API), they have 520 unique endpoint paths and 773 operations within said endpoints, and the only officially supported API client for v1 is [written in Python](https://developer.cisco.com/meraki/api-v1/python/).

With that all said, this library is **officially deprecated** for future Cisco Meraki API development. This repository will remain for anyone who's used this library before and is looking for an [alternative solution below](#alternative-solutions). The following documentation links have been updated but it's recommended to always check the [official documentation website](https://developer.cisco.com/meraki/api-v1/).

# Documentation (Updated since December 2024)

* [Official Documentation Website](https://developer.cisco.com/meraki/api-v1/)
* [Official Python Library](https://github.com/meraki/dashboard-api-python/)
* [API Reference (v1)](https://github.com/meraki/dashboard-api-python/)
* [Postman Documentation](https://documenter.getpostman.com/view/897512/SzYXYfmJ)
* [OpenAPI Specification](https://github.com/meraki/openapi)

## Additional Resources

* [Meraki Read-only Sandbox](https://devnetsandbox.cisco.com/DevNet/catalog/meraki-always-on_meraki-always-on) - This read-only sandbox provides a *"developer environment to experiment with the Cisco Meraki Dashboard, Dashboard API, Captive Portal integration, MV Sense, Webhook Alerts, and Location Scanning"*

# Alternative Solutions

You now have a few options that you can consider in place of this library, for which I've listed the instructions for the first 2. The 3rd one is NOT a solution I officially endorse, but it is an option if you desire a strongly-typed API interface.
1. Switch to their official Python Client Library.
2. Use Axios (via the Client pattern) for API calls
3. Use an OpenAPI client generator like [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts).

## Official Python Client Library

### Installation
```bash
pip install --upgrade meraki

export MERAKI_DASHBOARD_API_KEY=YOUR_KEY_HERE
```

### Sync version
```python
import meraki

dashboard = meraki.DashboardAPI()
my_orgs = dashboard.organizations.getOrganizations()

for org in my_orgs:
    print(org)
```

### Async version
```python
import asyncio
import meraki.aio

def main():
    async with meraki.aio.AsyncDashboardAPI() as aiomeraki:
        my_orgs = await aiomeraki.organizations.getOrganizations()

    for org in my_orgs:
        print(org)

if __name__ == "__main__":
    asyncio.run(main())

```

## Axios for API Calls

### Installation
```bash
npm install --save axios
```

```js
import axios from 'axios';

// TODO: Change this line
const API_KEY = 'INSERT_API_KEY_HERE';

const meraki = axios.create({
    baseURL: 'https://api.meraki.com/api/v1/',
    headers: {
        'X-Cisco-Meraki-API-Key': API_KEY,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
    },
})

const my_orgs = await meraki.get('/organizations');
for (const org of my_orgs) {
    console.log(org);
}
```
