# Changelog

## v2.0.0 - (Dec/22/2018)

### :warning: Breaking Changes :warning:

#### Upgrading to v2.0.0

#### Removed endpoints - [@tejashah88](https://github.com/tejashah88)
* Hotspot 2.0 - It seems to have been removed without any explicit warning

#### Changed Endpoints - [@tejashah88](https://github.com/tejashah88)
* `dashboard.devices.lldp_cdp_info` => `dashboard.devices.lldpCdpInfo`

### New features

* Added ability to make custom REST calls in light of the rapidly evolving API and the new API endpoints - [@tejashah88](https://github.com/tejashah88)

### New API Endpoints
* Added approximately 60 new endpoints - [@tejashah88](https://github.com/tejashah88)

#### New groups added - [@tejashah88](https://github.com/tejashah88)
* Alert Settings - `dashboard.alert_settings`
* Analytics - `dashboard.analytics`
* Cameras - `dashboard.cameras`
* HTTP Servers - `dashboard.http_servers`
* Wireless Health - `dashboard.wireless_health`
* Splash Page - `dashboard.splash_page`
* Named tag scope - `dashboard.named_tag_scope`
* Syslog servers - `dashboard.syslog_servers`
* Phone announcements - `dashboard.phone_announcements`
* Firewalled services - `dashboard.firewalled_services`

#### New endpoints in existing groups - [@tejashah88](https://github.com/tejashah88)
* Clients - `dashboard.clients`
* SM - `dashboard.sm`
* VLANs - `dashboard.vlans`
* Devices - `dashboard.devices`

### Bug fixes
* Fixed not being able to retrieve the events from a client - [@tejashah88](https://github.com/tejashah88)
* Fixed not being able to retrieve the security events endpoint - [@tejashah88](https://github.com/tejashah88)
* Fixed not being able to pass parameters for binding a network to a template - [@tejashah88](https://github.com/tejashah88)

### Miscellaneous
* Added unit testing of source and utility functions as well as an experimental API coverage tool (see the announcement in the [README](README.md) for more details) - [@tejashah88](https://github.com/tejashah88)

## v1.2.0 - (June/8/2018)

### New API Endpoints
#### New groups added - [@tejashah88](https://github.com/tejashah88)
* Bluetooth Clients - `dashboard.bluetooth_clients`
* Meraki Auth - `dashboard.meraki_auth`
* Personal Identifying Information - `dashboard.pii[organizations/networks]`
  * Applies for both organizations and networks

#### New endpoints in existing groups
* Clients - `dashboard.clients` - [@tejashah88](https://github.com/tejashah88)

### Bug fixes
* [#4](https://github.com/tejashah88/node-meraki-dashboard/issues/4): Fixed a bug where org IDs longer than 16 digits would have their trailing digits be set to zero upon being parsed to JSON. This was due to how javascript handles integers larger than (2<sup>53</sup> - 1) - [@tejashah88](https://github.com/tejashah88)

## v1.1.0 - (May/9/2018)

### New API Endpoints
#### New groups added
* Phone conference rooms - `dashboard.phone_comference_rooms` - [@tejashah88](https://github.com/tejashah88)

## v1.0.1 - (May/2/2018)

### New API Endpoints
* Added new endpoint to get device statuses from an org - `dashboard.organizations.getDeviceStatuses` - [@tejashah88](https://github.com/tejashah88)

### Bug Fixes
* Fixed not being able to update an admin's attributes - [@tejashah88](https://github.com/tejashah88)

## v1.0.0 - (March/2/2018)

### First official release

### :warning: Breaking Changes :warning:

#### Upgrading to v1.0.0

* Functions that took only one parameter for the `params` object are flattened - [@tejashah88](https://github.com/tejashah88)
* The affected functions are as follows:
  * `dashboard.clients`
    * `list`
    * `getPolicy`
  * `dashboard.devices`
    * `lldp_cdp_info`
  * `dashboard.networks`
    * `listAirMarshalScanResults`

### Bug Fixes

* [#2](https://github.com/tejashah88/node-meraki-dashboard/issues/2): The base url is changed from `dashboard.meraki.com` to `api.meraki.com` - [@tejashah88](https://github.com/tejashah88)
