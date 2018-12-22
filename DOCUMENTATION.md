## Table of Contents
* [Documentation](#documentation)
  * [Admins](#admins)
  * [Alert settings](#alert-settings)
  * [Analytics](#analytics)
  * [Cameras](#cameras)
  * [Bluetooth Clients](#bluetooth-clients)
  * [Clients](#clients)
  * [Config templates](#config-templates)
  * [Devices](#devices)
  * [Firewalled services](#firewalled-services)
  * [Group policies](#group-policies)
  * [HTTP Servers](#http-servers)
  * [MR L3 Firewall](#mr-l3-firewall)
  * [MX L3 Firewall](#mx-l3-firewall)
  * [MX VPN Firewall](#mx-vpn-firewall)
  * [MX Cellular Firewall](#mx-cellular-firewall)
  * [Named tag scope](#named-tag-scope)
  * [Networks](#networks)
  * [Organizations](#organizations)
  * [Phone announcements](#phone-announcements)
  * [Phone assignments](#phone-assignments)
  * [Phone callgroups](#phone-callgroups)
  * [Phone conference rooms](#phone-conference-rooms)
  * [Phone contacts](#phone-contacts)
  * [Phone numbers](#phone-numbers)
  * [Personal Identifying Information (PII)](#personal-identifying-information-pii)
  * [SAML roles](#saml-roles)
  * [System Manager](#system-manager)
    * [Cisco Clarity](#cisco-clarity)
    * [Cisco Umbrella](#cisco-umbrella)
    * [Cisco Polaris](#cisco-polaris)
    * [Device](#device)
    * [Misc. Functions](#misc-functions)
  * [SSIDs](#ssids)
  * [Splash Page](#splash-page)
  * [Static routes](#static-routes)
  * [Switch ports](#switch-ports)
  * [Syslog servers](#syslog-servers)
  * [VLANs](#vlans)
  * [Wireless Health](#wireless-health)
    * [Connectivity Info](#connectivity-info)
    * [Latency Info](#latency-info)
    * [Misc. Functions](#misc-functions)
  * [Custom API calls](#custom-api-calls)

## Documentation
* Official Documentation: https://api.meraki.com/api_docs
* Postman Documentation: https://documenter.getpostman.com/view/897512/2To9xm

##### All functions return a promise, which either resolves to the data received, or rejects with an error.
##### Despite the prescence of types in the documentation, they are NOT enforced in the library. They are more useful as a guide but passing the wrong kind of data can cause unexpected behavior.

### Admins
```javascript
// List the dashboard administrators in this organization.
Array dashboard.admins.list(String organization_id)

// Create a new dashboard administrator.
Object dashboard.admins.create(String organization_id, Object params)

// Update an administrator.
Object dashboard.admins.update(String organization_id, String admin_id, Object params)

// Revoke all access for a dashboard administrator within this organization.
dashboard.admins.revoke(String organization_id, String admin_id)
```

### Alert settings
```javascript
// Return the alert configuration for this network.
Object dashboard.alert_settings.get(String network_id)

// Update the alert configuration for this network.
Object dashboard.alert_settings.update(String network_id, Object params)
```

### Analytics
```javascript
// Returns an overview of aggregate analytics data for a timespan.
Object dashboard.analytics.overview(String serial)

// Returns all configured analytic zones for this camera.
Object dashboard.analytics.zones(String serial)

// Return historical records for analytic zones.
Object dashboard.analytics.historicalRecords(String serial, String zone_id, Object params)

// Returns most recent record for analytics zones.
Object dashboard.analytics.recentRecords(String serial)

// Returns live state from camera of analytics zones.
Object dashboard.analytics.liveRecords(String serial)
```

### Bluetooth Clients
```javascript
// List the Bluetooth clients seen by APs in this network.
Array dashboard.bluetooth_clients.list(String network_id, Object params)

// Return a Bluetooth client.
Object dashboard.bluetooth_clients.get(String network_id, String client_mac, Object params)
```

### Cameras
```javascript
// Returns video link for the specified camera. If a timestamp supplied, it links to that time.
Object dashboard.cameras.videoLink(String network_id, String serial, Number timestamp)
```

### Clients
```javascript
// List the clients of a device, up to a maximum of a month ago. The usage of each client is returned in kilobytes.
// If the device is a switch, the switchport is returned; otherwise the switchport field is null.
// The timespan must be less than or equal to 2592000 seconds (or one month).
Array dashboard.clients.list(String serial, Number timespan)

// Return the client associated with the given identifier. This endpoint will lookup by client ID or either the MAC or IP depending on whether the network uses Track-by-IP.
Object dashboard.clients.get(String network_id, String client_id_or_mac_or_ip)

// Return the client's daily usage history. Usage data is in kilobytes.
Array dashboard.clients.usageHistory(String network_id, String client_id_or_mac_or_ip)

// Return the client's network traffic data over time. Usage data is in kilobytes. This endpoint requires detailed traffic analysis to be enabled on the Network-wide > General page.
Array dashboard.clients.trafficHistory(String network_id, String client_id_or_mac_or_ip, Object params)

// Return the events associated with this client.
Array dashboard.clients.events(String network_id, String client_id_or_mac_or_ip, Object params)

// Return the latency history for a client. The latency data is from a sample of 2% of packets and is grouped into 4 traffic categories: background, best effort, video, voice. Within these categories the sampled packet counters are bucketed by latency in milliseconds.
Array dashboard.client.latencyHistory(String network_id, String client_id_or_mac_or_ip, Object params)

// Return a client's security events.
Array dashboard.clients.securityEvents(String network_id, String client_mac, Object params)

// Return the policy assigned to a client on the network. The timespan must be less than or equal to 2592000 seconds (or one month).
Object dashboard.clients.getPolicy(String network_id, String client_mac, Number timespan)

// Update the policy assigned to a client on the network.
Object dashboard.clients.updatePolicy(String network_id, String client_mac, Object params)

// Return the splash authorization for a client, for each SSID they've associated with through splash.
Object dashboard.clients.getSplashAuth(String network_id, String client_mac)

// Update a client's splash authorization.
Object dashboard.clients.updateSplashAuth(String network_id, String client_mac, Object params)
```

### Config templates
```javascript
// List the configuration templates for this organization.
Array dashboard.config_templates.list(String organization_id)

// Remove a configuration template.
dashboard.config_templates.remove(String organization_id, String template_id)
```

### Devices
```javascript
// List the devices in a network.
Array dashboard.devices.list(String network_id)

// Return a single device.
Object dashboard.devices.get(String network_id, String serial)

// Return an array containing the uplink information for a device.
Array dashboard.devices.getUplinkInfo(String network_id, String serial)

// Update the attributes of a device.
Object dashboard.devices.update(String network_id, String serial, Object params)

// Claim a device into a network.
dashboard.devices.claim(String network_id, Object params)

// Remove a single device.
dashboard.devices.remove(String network_id, String serial)

// List LLDP and CDP information for a device. The timespan must be less than or equal to 2592000 seconds (or one month).
Object dashboard.devices.lldpCdpInfo(String network_id, String serial, Number timespan)

// Get the uplink loss percentage and latency in milliseconds for a wired network device.
Array dashboard.devices.lossAndLatencyHistory(String network_id, String serial, Object params)

// Return the performance score for a single device (MX).
// Extra documentation: https://documentation.meraki.com/MX/Monitoring_and_Reporting/Device_Utilization
Object dashboard.devices.performanceScore(String network_id, String serial)
```

### Firewalled services
```javascript
// List the appliance services and their accessibility rules.
Array dashboard.firewalled_services.list(String network_id)

// Return the accessibility settings of the given service ('ICMP', 'web', or 'SNMP').
Object dashboard.firewalled_services.get(String network_id, String service)

// Updates the accessibility settings for the given service ('ICMP', 'web', or 'SNMP').
Object dashboard.firewalled_services.update(String network_id, String service, Object params)
```

### Group policies
```javascript
// List the group policies in a network.
Array dashboard.group_policies.list(String network_id)
```

### HTTP servers
```javascript
// List the HTTP servers for a network.
Array dashboard.http_servers.list(String network_id)

// Return an HTTP server.
Object dashboard.http_servers.get(String network_id, String server_id)

// Update an HTTP server.
Object dashboard.http_servers.update(String network_id, String server_id, Object params)

// Add an HTTP server.
Object dashboard.http_servers.create(String network_id, Object params)

// Delete an HTTP server.
dashboard.http_servers.delete(String network_id, String server_id)

// Send a test webhook.
Object dashboard.http_servers.test(String network_id, String url)

// Return the status of a webhook test.
Object dashboard.http_servers.testStatus(String network_id, String test_id)
```

### Meraki Auth
```javascript
// List the splash or RADIUS users configured under Meraki Authentication for a network.
Array dashboard.meraki_auth.list(String network_id)

// Return the specified splash or RADIUS user.
Object dashboard.meraki_auth.get(String network_id, String user_id)
```

### MR L3 Firewall
```javascript
// Return the L3 firewall rules for an SSID on an MR network.
Array dashboard.mr_l3_firewall.getRules(String network_id, Number ssid)

// Update the L3 firewall rules of an SSID on an MR network.
Array dashboard.mr_l3_firewall.updateRules(String network_id, Number ssid, Object params)
```

### MX L3 Firewall
```javascript
// Return the L3 firewall rules for an MX network.
Array dashboard.mx_l3_firewall.getRules(String network_id)

// Update the L3 firewall rules of an MX network.
Array dashboard.mx_l3_firewall.updateRules(String network_id, Object params)
```

### MX VPN Firewall
```javascript
// Return the firewall rules for an organization's site-to-site VPN.
Array dashboard.mx_vpn_firewall.getRules(String organization_id)

// Update firewall rules of an organization's site-to-site VPN.
Array dashboard.mx_vpn_firewall.updateRules(String organization_id, Object params)
```

### MX Cellular Firewall
```javascript
// Return the firewall rules for an organization's site-to-site VPN.
Array dashboard.mx_cellular_firewall.getRules(String network_id)

// Update firewall rules of an organization's site-to-site VPN.
Array dashboard.mx_cellular_firewall.updateRules(String network_id, Object params)
```

### Named tag scope
```javascript
// List the named tag scopes in this network.
Array dashboard.named_tag_scope.list(String network_id, Boolean with_details)

// Return a named tag scope.
Object dashboard.named_tag_scope.get(String network_id, String named_tag_scope_id, Boolean with_details)

// Update a named tag scope.
Object dashboard.named_tag_scope.update(String network_id, String named_tag_scope_id, Object params)

// Add a named_tag_scope.
Object dashboard.named_tag_scope.create(String network_id, Object params)

// Delete a named tag scope from a network.
dashboard.named_tag_scope.delete(String network_id, String named_tag_scope_id)
```

### Networks
```javascript
// List the networks in an organization.
Array dashboard.networks.list(String organization_id)

// Return a network.
Object dashboard.networks.get(String network_id)

// Update a network.
Object dashboard.networks.update(String network_id, Object params)

// Create a network.
Object dashboard.networks.create(String organization_id, Object params)

// Delete a network.
dashboard.networks.delete(String network_id)

// Bind a network to a template.
dashboard.networks.bindToTemplate(String network_id)

// Unbind a network from a template.
dashboard.networks.unbindFromTemplate(String network_id)

// Return the site-to-site VPN settings of a network. Only valid for MX networks.
Object dashboard.networks.getSiteToSiteVpn(String network_id)

// Update the site-to-site VPN settings of a network. Only valid for MX networks in NAT mode.
Object dashboard.networks.updateSiteToSiteVpn(String network_id, Object params)

// The traffic analysis data for this network. Traffic Analysis with Hostname Visibility must be enabled on the network.
Array dashboard.networks.getTrafficData(String network_id, Object params)

// List the access policies for this network. Only valid for MS networks.
Array dashboard.networks.listAccessPolicies(String network_id)

// List Air Marshal scan results from a network. The timespan must be less than or equal to 2592000 seconds (or one month).
Array dashboard.networks.listAirMarshalScanResults(String network_id, Number timespan)

// Return the Bluetooth settings for a network. Bluetooth settings must be enabled on the network.
Object dashboard.networks.getBluetoothSettings(String network_id)

// Update the Bluetooth settings for a network. See the docs page for Bluetooth settings.
Object dashboard.networks.updateBluetoothSettings(String network_id, Object params)
```

### Organizations
```javascript
// List the organizations that the user has privileges on.
Array dashboard.organizations.list()

// Return an organization.
Object dashboard.organizations.get(String organization_id)

// Update an organization.
Object dashboard.organizations.update(String organization_id, Object params)

// Create a new organization.
Object dashboard.organizations.create(Object params)

// Create a new organization by cloning the addressed organization.
Object dashboard.organizations.clone(String organization_id, Object params)

// Claim a device, license key, or order into an organization. When claiming by order, all devices and licenses in
// that order will be claimed; licenses will be added to the organization and devices will be placed in the organization's
// inventory. These three types of claims are mutually exclusive and cannot be performed in one request.
dashboard.organizations.claimDevice(String organization_id, Object params)

// Return the license state for an organization.
Object dashboard.organizations.getLicenseState(String organization_id)

// Return the inventory for an organization.
Array dashboard.organizations.getInventory(String organization_id)

// Return the statuses of all devices in an organization.
Array dashboard.organizations.getDeviceStatuses(String organization_id)

// Return the SNMP settings for an organization.
Object dashboard.organizations.getSnmpSettings(String organization_id)

// Update the SNMP settings for an organization.
Object dashboard.organizations.updateSnmpSettings(String organization_id, Object params)

// Return the third party VPN peers for an organization.
Array dashboard.organizations.getThirdPartyVpnPeers(String organization_id)

// Update the third party VPN peers for an organization.
Array dashboard.organizations.updateThirdPartyVpnPeers(String organization_id, Object params)
```

### Phone announcements
```javascript
// List all announcement groups in a network.
Array dashboard.phone_announcements.list(String network_id)

// Add an announcement group.
Object dashboard.phone_announcements.add(String network_id, String name)

// Delete an announcement group.
dashboard.phone_announcements.delete(String network_id, String group_id)
```

### Phone assignments
```javascript
// List all phones in a network and their contact assignment.
Array dashboard.phone_assignments.list(String network_id)

// Return a phone's contact assignment.
Object dashboard.phone_assignments.get(String network_id, String serial)

// Assign a contact and number(s) to a phone.
Object dashboard.phone_assignments.assign(String network_id, String serial, Object params)

// Remove a phone assignment (unprovision a phone).
dashboard.phone_assignments.delete(String network_id, String serial)
```

### Phone callgroups
```javascript
// List all call groups in a network.
Array dashboard.phone_callgroups.list(String network_id)

// Show a call group's details.
Object dashboard.phone_callgroups.get(String network_id, String call_group_id)

// Create a new call group.
Object dashboard.phone_callgroups.create(String network_id, Object params)

// Update a call group's details. Only submit parameters you would like to update. Omitting any parameters will leave them as-is.
Object dashboard.phone_callgroups.update(String network_id, String call_group_id, Object params)

// Delete a call group.
dashboard.phone_callgroups.delete(String network_id, String call_group_id)
```

### Phone conference rooms
```javascript
// List all the phone conference rooms in a network.
Array dashboard.phone_comference_rooms.list(String network_id)

// Show a conference room's details.
Object dashboard.phone_comference_rooms.get(String network_id, String room_id)

// Add a conference room.
Object dashboard.phone_comference_rooms.create(String network_id, Object params)

// Update a conference room. Only submit parameters you would like to update. Omitting any parameters will leave them as-is.
Object dashboard.phone_comference_rooms.update(String network_id, String room_id, Object params)

// Delete a conference room.
dashboard.phone_comference_rooms.delete(String network_id, String room_id)
```

### Phone contacts
```javascript
// List the phone contacts in a network.
Array dashboard.phone_contacts.list(String network_id)

// Add a contact.
Object dashboard.phone_contacts.add(String network_id, String name)

// Update a phone contact. Google Directory contacts cannot be modified.
Object dashboard.phone_contacts.update(String network_id, String contact_id, String name)

// Delete a phone contact. Google Directory contacts cannot be removed.
dashboard.phone_contacts.delete(String network_id, String contact_id)
```

### Phone numbers
```javascript
// List all the phone numbers in a network.
Array dashboard.phone_numbers.listAll(String network_id)

// List the available phone numbers in a network.
Object dashboard.phone_numbers.listAvailable(String network_id)
```

### Personal Identifying Information (PII)
##### Applies for both organizations and networks
```javascript
// List the keys required to access PII for a given identifier. Exactly one identifier will be accepted.
Object dashboard.pii.organizations.list(String organization_id, Object params)
Object dashboard.pii.networks.list(String network_id, Object params)

// Given a piece of PII, return the Systems Manager device ID(s) associated with that identifier. These device IDs can be used with the Systems Manager API endpoints to retrieve device details. Exactly one identifier will be accepted.
Object dashboard.pii.organizations.getDeviceId(String organization_id, Object params)
Object dashboard.pii.networks.getDeviceId(String network_id, Object params)

// Given a piece of PII, return the Systems Manager owner ID(s) associated with that identifier. These owner IDs can be used with the Systems Manager API endpoints to retrieve owner details. Exactly one identifier will be accepted.
Object dashboard.pii.organizations.listSMOwners(String organization_id, Object params)
Object dashboard.pii.networks.listSMOwners(String network_id, Object params)

// List the PII requests for an organization/network.
Array dashboard.pii.organizations.listRequests(String organization_id)
Array dashboard.pii.networks.listRequests(String network_id)

// Return a PII request for an organization/network.
Object dashboard.pii.organizations.getRequest(String network_id, String request_id)
Object dashboard.pii.networks.getRequest(String network_id, String request_id)

// Submit a new delete or restrict processing PII request.
Object dashboard.pii.organizations.submitRequest(String network_id, Object params)
Object dashboard.pii.networks.submitRequest(String network_id, Object params)

// Delete a restrict processing PII request.
dashboard.pii.organizations.deleteRequest(String network_id, String request_id)
dashboard.pii.networks.deleteRequest(String network_id, String request_id)
```

### SAML roles
```javascript
// List the SAML roles for this organization.
Array dashboard.saml_roles.list(String organization_id)

// Return a SAML role.
Object dashboard.saml_roles.get(String organization_id, String role_id)

// Update a SAML role.
Object dashboard.saml_roles.update(String organization_id, String role_id, Object params)

// Create a SAML role.
Object dashboard.saml_roles.create(String organization_id, Object params)

// Remove a SAML role.
dashboard.saml_roles.delete(String organization_id, String role_id)
```

### System Manager

#### Cisco Clarity
```javascript
// Create a new profile containing a Cisco Clarity payload.
Object dashboard.sm.cisco_clarity.createProfile(String network_id, Object params)

// Update an existing profile containing a Cisco Clarity payload.
Object dashboard.sm.cisco_clarity.updateProfile(String network_id, String profile_id, Object params)

// Add a Cisco Clarity payload to an existing profile.
Object dashboard.sm.cisco_clarity.addPayload(String network_id, String profile_id, Object params)

// Get details for a Cisco Clarity payload.
Object dashboard.sm.cisco_clarity.getPayloadDetails(String network_id, String profile_id)

// Delete a Cisco Clarity payload. Deletes the entire profile if it's empty after removing the payload.
Object dashboard.sm.cisco_clarity.deletePayload(String network_id, String profile_id)
```

#### Cisco Umbrella
```javascript
// Create a new profile containing a Cisco Umbrella payload.
Object dashboard.sm.cisco_umbrella.createProfile(String network_id, Object params)

// Update an existing profile containing a Cisco Umbrella payload.
Object dashboard.sm.cisco_umbrella.updateProfile(String network_id, String profile_id, Object params)

// Add a Cisco Umbrella payload to an existing profile.
Object dashboard.sm.cisco_umbrella.addPayload(String network_id, String profile_id, Object params)

// Get details for a Cisco Umbrella payload.
Object dashboard.sm.cisco_umbrella.getPayloadDetails(String network_id, String profile_id)

// Delete a Cisco Umbrella payload. Deletes the entire profile if it's empty after removing the payload.
Object dashboard.sm.cisco_umbrella.deletePayload(String network_id, String profile_id)
```

#### Cisco Polaris
```javascript
// Create a new Polaris app.
Object dashboard.sm.cisco_polaris.createApp(String network_id, Object params)

// Update an existing Polaris app.
Object dashboard.sm.cisco_polaris.updateApp(String network_id, String app_id, Object params)

// Get details for a Cisco Polaris app if it exists.
Object dashboard.sm.cisco_polaris.getAppDetails(String network_id, String bundle_id)

// Delete a Cisco Polaris app.
Object dashboard.sm.cisco_polaris.deleteApp(String network_id, String app_id)
```

#### Device
```javascript
// List the network adapters of a device.
Array dashboard.sm.device.networkAdapters(String network_id, String device_id)

// List the saved SSID names on a device.
Array dashboard.sm.device.wlanLists(String network_id, String device_id)

// List the security centers on a device.
Array dashboard.sm.device.securityCenters(String network_id, String device_id)

// List the restrictions on a device.
Array dashboard.sm.device.restrictions(String network_id, String device_id)

// List the certs on a device.
Array dashboard.sm.device.certs(String network_id, String device_id)

// Return the client's daily cellular data usage history. Usage data is in kilobytes.
Object dashboard.sm.device.cellularUsage(String network_id, String device_id)

// Return historical records of various Systems Manager client metrics for desktop devices.
Array dashboard.sm.device.performanceHistory(String network_id, String device_id, Object params)

// Return historical records of various Systems Manager network connection details for desktop devices.
Array dashboard.sm.device.(String network_id, String device_id, Object params)

// Return historical records of commands sent to Systems Manager devices.
Object dashboard.sm.device.(String network_id, String device_id, Object params)

// Returns historical connectivity data (whether a device is regularly checking in to Dashboard).
Object dashboard.sm.device.(String network_id, String device_id, Object params)
```

#### Misc. Functions
```javascript
// List the devices enrolled in an SM network with various specified fields and filters.
Array dashboard.sm.listDevices(String network_id)

// List the owners in an SM network with various specified fields and filters.
Array dashboard.sm.listOwners(String network_id, Object params)

// Get the profiles associated with a user.
Array dashboard.sm.listProfilesByUser(String network_id, String user_id)

// Get the profiles associated with a device.
Array dashboard.sm.listProfilesByDevice(String network_id, String device_id)

// Get a list of softwares associated with a user.
Array dashboard.sm.listSoftwareByUser(String network_id, String user_id)

// Get a list of softwares associated with a device.
Array dashboard.sm.listSoftwareByDevice(String network_id, String device_id)

// Add, delete, or update the tags of a set of devices.
Object dashboard.sm.editTags(String network_id, Object params)

// Modify the fields of a device.
Object dashboard.sm.editFields(String network_id, Object params)

// Lock a set of devices.
Object dashboard.sm.lockDevices(String network_id, Object params)

// Wipe a device.
Object dashboard.sm.wipeDevice(String network_id, Object params)

// Force check-in a set of devices.
Object dashboard.sm.forceCheckInDevices(String network_id, Object params)

// Move a set of devices to a new network.
Object dashboard.sm.moveDevices(String network_id, Object params)

// List all the profiles in the network.
Object dashboard.sm.listProfiles(String network_id)
```

### SSIDs
```javascript
// List the SSIDs in a network.
Array dashboard.ssids.list(String network_id)

// Return a single SSID.
Object dashboard.ssids.get(String network_id, String ssid)

// Update the attributes of an SSID.
Object dashboard.ssids.update(String network_id, String ssid, Object params)
```

### Splash Page
```javascript
// List the splash login attempts for a network.
Array dashboard.splash_page.loginAttempts(String network_id, Object params)

// Display the splash page settings for the given SSID
Object dashboard.splash_page.getSettings(String network_id, String ssid)

// Modify the splash page settings for the given SSID
Object dashboard.splash_page.updateSettings(String network_id, String ssid, Object params)
```

### Static routes
```javascript
// List the static routes for this network.
Array dashboard.static_routes.list(String network_id)

// Return a static route.
Object dashboard.static_routes.get(String network_id, String sr_id)

// Update a static route.
Object dashboard.static_routes.update(String network_id, String sr_id, Object params)

// Add a static route.
Object dashboard.static_routes.add(String network_id, Object params)

// Delete a static route from a network.
dashboard.static_routes.delete(String network_id, String sr_id)
```

### Switch ports
```javascript
// List the switch ports for a switch.
Array dashboard.switch_ports.list(String serial)

// Return a switch port.
Object dashboard.switch_ports.get(String serial, Number port_number)

// Update a switch port.
Object dashboard.switch_ports.update(String serial, Number port_number, Object params)
```

### Syslog servers
```javascript
// List the syslog servers for a network.
Array dashboard.syslog_servers.list(String network_id)

// Update the syslog servers for a network.
Array dashboard.syslog_servers.update(String network_id, Array servers)
```

### VLANs
```javascript
// List the VLANs for this network.
Array dashboard.vlans.list(String network_id)

// Return a VLAN.
Object dashboard.vlans.get(String network_id, String vlan_id)

// Update a VLAN.
Object dashboard.vlans.update(String network_id, String vlan_id, Object params)

// Add a VLAN.
Object dashboard.vlans.add(String network_id, Object params)

// Delete a VLAN from a network.
dashboard.vlans.delete(String network_id, String vlan_id)

// Returns the enabled status of VLANs for the network.
Object dashboard.vlans.isEnabled(String network_id)

// Enable/Disable VLANs for the given network.
Object dashboard.vlans.setEnabled(String network_id, Boolean enabled)
```

### Wireless Health

#### Connectivity Info
```javascript
// Aggregated connectivity info for this network.
Object dashboard.wireless_health.connectivity_info.general(String network_id, Object params)

// Aggregated connectivity info for this network, grouped by node.
Array dashboard.wireless_health.connectivity_info.groupByNode(String network_id, Object params)

// Aggregated connectivity info for a given AP on this network.
Object dashboard.wireless_health.connectivity_info.forAP(String network_id, String serial, Object params)

// Aggregated connectivity info for this network, grouped by clients.
Array dashboard.wireless_health.connectivity_info.groupByClient(String network_id, Object params)

// Aggregated connectivity info for a given client on this network.
Object dashboard.wireless_health.connectivity_info.forClient(String network_id, String client_id, Object params)
```

#### Latency Info
```javascript
// Aggregated latency info for this network.
Object dashboard.wireless_health.latency_info.general(String network_id, Object params)

// Aggregated latency info for this network, grouped by node.
Array dashboard.wireless_health.latency_info.groupByNode(String network_id, Object params)

// Aggregated latency info for a given AP on this network.
Object dashboard.wireless_health.latency_info.forAP(String network_id, String serial, Object params)

// Aggregated latency info for this network, grouped by clients.
Array dashboard.wireless_health.latency_info.groupByClient(String network_id, Object params)

// Aggregated latency info for a given client on this network.
Object dashboard.wireless_health.latency_info.forClient(String network_id, String client_id, Object params)
```

#### Misc. Functions
```javascript
// List of all failed client connection events on this network in a given time range
Array dashboard.wireless_health.failed_events(String network_id, Object params)
```

### Custom API calls
Just in case that some API methods may not be covered by this module, a bunch of custom functions are available to use. They will return the parsed response received from making the call.

```javascript
// Perform a custom HEAD request
Object dashboard.custom.head(String url)

// Perform a custom GET request
Object dashboard.custom.get(String url, Object parameters)

// Perform a custom POST request
Object dashboard.custom.post(String url, Object parameters)

// Perform a custom PUT request
Object dashboard.custom.put(String url, Object parameters)

// Perform a custom DELETE request
Object dashboard.custom.delete(String url)
```