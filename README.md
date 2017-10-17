# node-meraki-dashboard
A node.js client library for using the Meraki Dashboard API.

## Table Of Contents

* [Documentation](#documentation)
    * [Admins](#admins)
    * [Clients](#clients)
    * [Config templates](#config-templates)
    * [Devices](#devices)
    * [MX L3 Firewall](#mx-l3-firewall)
    * [MR L3 Firewall](#mr-l3-firewall)
    * [Group policies](#group-policies)
    * [Networks](#networks)
    * [Organizations](#organizations)
    * [Phone assignments](#phone-assignments)
    * [Phone contacts](#phone-contacts)
    * [Phone numbers](#phone-numbers)
    * [SAML roles](#saml-roles)
    * [SM](#sm)
    * [SSIDs](#ssids)
    * [Static routes](#static-routes)
    * [Switch ports](#switch-ports)
    * [VLANs](#vlans)
* [Examples](#examples)
    * [Using Promises (normal functions)](#using-promises-normal-functions)
    * [Using Promises (arrow functions)](#using-promises-arrow-functions)
    * [Using Async/Await](#using-asyncawait)

## Documentation
Official Documentation: https://dashboard.meraki.com/api_docs

All methods return a promise, which either resolves to the data received, or rejects with an error.

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

### Clients
```javascript
// List the clients of a device, up to a maximum of a month ago. The usage of each client is returned in kilobytes. If the device is a switch, the switchport is returned; otherwise the switchport field is null.
Array dashboard.clients.list(String serial, Object params)

// Return the policy assigned to a client on the network.
Object dashboard.clients.getPolicy(String network_id, String client_mac, Object params)

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
```

### MX L3 Firewall
```javascript
// Return the L3 firewall rules for an MX network.
Array dashboard.mx_l3_firewall.getRules(String network_id)

// Update the L3 firewall rules of an MX network.
Array dashboard.mx_l3_firewall.updateRules(String network_id, Object params)
```

### MR L3 Firewall
```javascript
// Return the L3 firewall rules for an SSID on an MR network.
Array dashboard.mr_l3_firewall.getRules(String network_id)

// Update the L3 firewall rules of an SSID on an MR network.
Array dashboard.mr_l3_firewall.updateRules(String network_id, Object params)
```

### Group policies
```javascript
// List the group policies in a network.
Array dashboard.group_policies.list(String network_id)
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
Object dashboard.networks.updateSiteToSiteVpn(String network_id)

// The traffic analysis data for this network. Traffic Analysis with Hostname Visibility must be enabled on the network.
Array dashboard.networks.getTrafficData(String network_id, Object params)

// List the access policies for this network. Only valid for MS networks.
Array dashboard.networks.listAccessPolicies(String network_id)

// List Air Marshal scan results from a network.
Array dashboard.networks.listAirMarshalScanResults(String network_id, Object params)

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

// Claim a device, license key, or order into an organization. When claiming by order, all devices and licenses in the order will be claimed; licenses will be added to the organization and devices will be placed in the organization's inventory. These three types of claims are mutually exclusive and cannot be performed in one request.
dashboard.organizations.claimDevice(String organization_id, Object params)

// Return the license state for an organization.
Object dashboard.organizations.getLicenseState(String organization_id)

// Return the inventory for an organization.
Array dashboard.organizations.getInventory(String organization_id)

// Return the SNMP settings for an organization.
Object dashboard.organizations.getSnmpSettings(String organization_id)

// Update the SNMP settings for an organization.
Object dashboard.organizations.updateSnmpSettings(String organization_id, Object params)

// Return the third party VPN peers for an organization.
Array dashboard.organizations.getThirdPartyVpnPeers(String organization_id)

// Update the third party VPN peers for an organization.
Array dashboard.organizations.updateThirdPartyVpnPeers(String organization_id, Object params)
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

### Phone contacts
```javascript
// List the phone contacts in a network.
Array dashboard.phone_contacts.list(String network_id)

// Add a contact.
Object dashboard.phone_contacts.add(String network_id)

// Update a phone contact. Google Directory contacts cannot be modified.
Object dashboard.phone_contacts.update(String network_id, String contact_id, Object params)

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

### SM
```javascript
// List the devices enrolled in an SM network with various specified fields and filters.
Object dashboard.sm.listDevices(String network_id)

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
```

## Examples
### Using Promises (normal functions)
```javascript
var dashboard = require('node-meraki-dashboard')(apiKey)
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
var dashboard = require('node-meraki-dashboard')(apiKey)
dashboard.organizations.list()
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Using Async/Await
```javascript
var dashboard = require('node-meraki-dashboard')(apiKey)

(async function() {
  try {
    var orgList = await dashboard.organizations.list();
    console.log(orgList);
  } catch (error) {
    console.log(error);
  }
})();
```