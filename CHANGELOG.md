# Changelog

## v1.2.0

### New API Endpoints

#### Clients - `dashboard.clients`

* `get` - Retrieve a client either by client ID, MAC or IP address.
* `usageHistory` - Retrieve the client's daily usage history. Usage data is in kilobytes.
* `trafficHistory` - Retrieve the client's network traffic data over time. Usage data is in kilobytes.
* `events` - Retrieve a client's events.
* `securityEvents` - Retrieve a client's security events.

#### Bluetooth Clients - `dashboard.bluetooth_clients`

* `list` - List the Bluetooth clients seen by APs in this network.
* `get` - Retrieve a Bluetooth client.

#### Meraki Auth - `dashboard.meraki_auth`

* `list` - List the splash or RADIUS users configured under Meraki Authentication for a network.
* `get` - Retrieve the specified splash or RADIUS user.

#### Personal Identifying Information - dashboard.pii[organizations/networks]
##### Applies for both organizations and networks.

* `list` - List the keys required to access PII for a given identifier.
* `getDeviceId` - Given a piece of PII, retrieve the Systems Manager device ID(s) associated with that identifier.
* `listSMOwners` - Given a piece of PII, retrieve the Systems Manager owner ID(s) associated with that identifier.
* `listRequests` - List the PII requests for an organization/network.
* `getRequest` - Return a PII request for an organization/network.
* `submitRequest` - Submit a new delete or restrict processing PII request.
* `deleteRequest` - Delete a restrict processing PII request.

### Bug fixes
* Fixed a bug where org IDs longer than 16 digits would have their trailing digits be set to zero upon being parsed to JSON. This was due to how javascript handles integers larger than 2<sup>53</sup> - 1. This fixes issue [#4](https://github.com/tejashah88/node-meraki-dashboard/issues/4).

## v1.1.0

### New API Endpoints

#### Phone conference rooms - `dashboard.phone_comference_rooms`

* `list` - List all the phone conference rooms in a network.
* `get` - Show a conference room's details.
* `create` - Add a conference room.
* `update` - Update a conference room. Only submit parameters you would like to update. Omitting any parameters will leave them as-is.
* `delete` - Delete a conference room.

## v1.0.1

### New API Endpoint
* `dashboard.organizations.getDeviceStatuses` - Get device statuses from an org

### Bug Fixes
* Fixed not being able to update an admin's attributes.

## v1.0.0

### First official release

#### Upgrading to v1.0.0
* The base url is now `api.meraki.com` from `dashboard.meraki.com` (see #2)
* Functions that took only one parameter for the `params` object are streamlined. The affected functions are as follows:
  * `dashboard.clients`
    * `list`
    * `getPolicy`
  * `dashboard.devices`
    * `lldp_cdp_info`
  * `dashboard.networks`
    * `listAirMarshalScanResults`
