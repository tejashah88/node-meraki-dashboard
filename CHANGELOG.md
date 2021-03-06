# Changelog

## v3.0.0 - (Aug/7/2019)

### :warning: Breaking Changes :warning:

#### API Coverage Tool Changes
The postman docs that are used to fetch additional endpoints are being dropped in favor of exclusively using the official docs. The postman docs required more maintainance due to inconsistencies in formatting and they took a long time to fetch from the network (10 seconds!). Additionally, the blacklist is being dropped since it's original purpose was to account for odd postman endpoints that weren't properly filtered by the tool.

#### Upgrading to v3.0.0
* All endpoints in the 'Analytics' have been moved to 'MV Sense'
  * i.e. change `dashboard.analytics` to `dashboard.mv_sense`
* `dashboard.devices.list` used to list devices by network, and is now changed to `dashboard.devices.listByNetwork`

### New API Endpoints
* Added approximately 70 new endpoints

## v2.1.1 - (Feb/1/2019)
### Bug fixes
* [#7](https://github.com/tejashah88/node-meraki-dashboard/issues/7): Fixed being unable to import the library

## v2.1.0 - (Jan/29/2019)

### New API Endpoints
#### New groups added
* Content Filtering: Categories - `dashboard.content_filtering.categories`
* Content Filtering: Rules - `dashboard.content_filtering.rules`
* Switch settings - `dashboard.switch_settings`
* Uplink settings - `dashboard.uplink_settings`

#### New endpoints in existing groups
* Clients - `dashboard.clients`
  * Provision clients - `dashboard.clients.provision`

### Bug fixes
* Saving to blacklist will automatically disable current blacklist
* Blacklist generation can now include official endpoints

## v2.0.0 - (Dec/22/2018)

### :warning: Breaking Changes :warning:

#### Upgrading to v2.0.0

#### Removed endpoints
* Hotspot 2.0 - It seems to have been removed without any explicit warning

#### Changed Endpoints
* `dashboard.devices.lldp_cdp_info` => `dashboard.devices.lldpCdpInfo`

### New features

* Added ability to make custom REST calls in light of the rapidly evolving API and the new API endpoints

### New API Endpoints
* Added approximately 60 new endpoints

### Bug fixes
* Fixed not being able to retrieve the events from a client
* Fixed not being able to retrieve the security events endpoint
* Fixed not being able to pass parameters for binding a network to a template

### Miscellaneous
* Added unit testing of source and utility functions as well as an experimental API coverage tool (see the announcement in the [README](README.md) for more details)

## v1.2.0 - (June/8/2018)

### New API Endpoints
#### New groups added
* Bluetooth Clients - `dashboard.bluetooth_clients`
* Meraki Auth - `dashboard.meraki_auth`
* Personal Identifying Information - `dashboard.pii[organizations/networks]`
  * Applies for both organizations and networks

#### New endpoints in existing groups
* Clients - `dashboard.clients`
  * Get client - `dashboard.clients.get`
  * Get usage history - `dashboard.clients.usageHistory`
  * Get traffic history - `dashboard.clients.trafficHistory`
  * Get events - `dashboard.clients.events`
  * Get security events - `dashboard.clients.securityEvents`

### Bug fixes
* [#4](https://github.com/tejashah88/node-meraki-dashboard/issues/4): Fixed a bug where organization IDs longer than 16 digits would have their trailing digits be set to zero upon being parsed to JSON. This was due to how javascript handles integers larger than (2<sup>53</sup> - 1)

## v1.1.0 - (May/9/2018)

### New API Endpoints
#### New groups added
* Phone conference rooms - `dashboard.phone_comference_rooms`

## v1.0.1 - (May/2/2018)

### New API Endpoints
* Added new endpoint to get device statuses from an organization - `dashboard.organizations.getDeviceStatuses`

### Bug Fixes
* Fixed not being able to update an admin's attributes

## v1.0.0 - (March/2/2018)

### First official release

### :warning: Breaking Changes :warning:

#### Upgrading to v1.0.0

* Functions that took only one parameter for the `params` object are flattened
* The affected functions are as follows:
  * `dashboard.clients`
    * `list`
    * `getPolicy`
  * `dashboard.devices`
    * `lldp_cdp_info`
  * `dashboard.networks`
    * `listAirMarshalScanResults`

### Bug Fixes

* [#2](https://github.com/tejashah88/node-meraki-dashboard/issues/2): The base url is changed from `dashboard.meraki.com` to `api.meraki.com`
