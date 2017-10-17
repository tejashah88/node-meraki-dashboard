'use strict';

var axios = require('axios');

const ERRORS = {
  INVALID_API_KEY: 'Invalid API Key specified!'
};

function MerakiDashboard(apiKey) {
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw new Error(ERRORS.INVALID_API_KEY);
  }

  var dashboard = {};

  var rest = {
    client: axios.create({
      baseURL: 'https://dashboard.meraki.com/api/v0/',
      headers: {
        'X-Cisco-Meraki-API-Key': apiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      }
    }),
    get: function(url, parameters) {
      return this.client.get(url, { params: parameters !== undefined ? parameters : {} })
          .then(response => response.data)
          .catch(response => Promise.reject(response.response));
    },
    post: function(url, parameters) {
      return this.client.post(url, parameters !== undefined ? parameters : {})
          .then(response => response.data)
          .catch(response => Promise.reject(response.response));
    },
    put: function(url, parameters) {
      return this.client.put(url, parameters !== undefined ? parameters : {})
          .then(response => response.data)
          .catch(response => Promise.reject(response.response));
    },
    delete: function(url) {
      this.client.delete(url)
          .then(response => response.data)
          .catch(response => Promise.reject(response.response));
    }
  };

  dashboard.admins = {
    list: (org_id) => rest.get(`/organizations/${org_id}/admins`),
    create: (org_id, params) => rest.post(`/organizations/${org_id}/admins`, params),
    update: (org_id, admin_id, params) => rest.put(`/organizations/${org_id}/admins/${admin_id}`),
    revoke: (org_id, admin_id) => rest.delete(`/organizations/${org_id}/admins/${admin_id}`)
  };

  dashboard.clients = {
    list: (serial, params) => rest.get(`/devices/${serial}/clients`, params),
    getPolicy: (network_id, client_mac, params) => rest.get(`/networks/${network_id}/clients/${client_mac}/policy`, params),
    updatePolicy: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/policy`, params),
    getSplashAuth: (network_id, client_mac) => rest.get(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`),
    updateSplashAuth: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`, params)
  };

  dashboard.config_templates = {
    list: (org_id) => rest.get(`/organizations/${organization_id}/configTemplates`),
    remove: (org_id, template_id) => rest.delete(`/organizations/${organization_id}/configTemplates/${template_id}`)
  };

  dashboard.devices = {
    list: (network_id) => rest.get(`/networks/${network_id}/devices`),
    get: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}`),
    getUplinkInfo: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/uplink`),
    update: (network_id, serial, params) => rest.put(`/networks/${network_id}/devices/${serial}`, params),
    claim: (network_id, params) => rest.post(`/networks/${network_id}/devices/claim`, params),
    remove: (network_id, serial) => rest.post(`/networks/${network_id}/devices/${serial}/remove`, {})
  };

  dashboard.mx_l3_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/l3FirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/l3FirewallRules`, params),
  };

  dashboard.mr_l3_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`, params),
  };

  dashboard.group_policies = {
    list: (network_id) => rest.get(`/networks/${network_id}/groupPolicies`)
  };

  dashboard.networks = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/networks`),
    get: (network_id) => rest.get(`/networks/${network_id}`),
    update: (network_id, params) => rest.put(`/networks/${network_id}`, params),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/networks`, params),
    delete: (network_id) => rest.delete(`/networks/${network_id}`),
    bindToTemplate: (network_id) => rest.post(`/networks/${network_id}/bind`),
    unbindFromTemplate: (network_id) => rest.post(`/networks/${network_id}/unbind`),
    getSiteToSiteVpn: (network_id) => rest.get(`/networks/${network_id}/siteToSiteVpn`),
    updateSiteToSiteVpn: (network_id) => rest.put(`/networks/${network_id}/siteToSiteVpn`),
    getTrafficData: (network_id, params) => rest.get(`/networks/${network_id}/traffic`, params),
    listAccessPolicies: (network_id) => rest.get(`/networks/${network_id}/accessPolicies`),
    listAirMarshalScanResults: (network_id, params) => rest.get(`/networks/${network_id}/airMarshal`, params),
    getBluetoothSettings: (network_id) => rest.get(`/networks/${network_id}/bluetoothSettings`),
    updateBluetoothSettings: (network_id, params) => rest.put(`/networks/${network_id}/bluetoothSettings`, params),
  };

  dashboard.organizations = {
    list: () => rest.get('/organizations'),
    get: (organization_id) => rest.get(`/organizations/${organization_id}`),
    update: (organization_id, params) => rest.put(`/organizations/${organization_id}`, params),
    create: (params) => rest.post('/organizations', params),
    clone: (organization_id, params) => rest.post(`/organizations/${organization_id}/clone`, params),
    claimDevice: (organization_id, params) => rest.post(`/organizations/${organization_id}/claim`, params),
    getLicenseState: (organization_id) => rest.get(`/organizations/${organization_id}/licenseState`),
    getInventory: (organization_id) => rest.get(`/organizations/${organization_id}/inventory`),
    getSnmpSettings: (organization_id) => rest.get(`/organizations/${organization_id}/snmp`),
    updateSnmpSettings: (organization_id, params) => rest.put(`/organizations/${organization_id}/snmp`, params),
    getThirdPartyVpnPeers: (organization_id) => rest.get(`/organizations/${organization_id}/thirdPartyVPNPeer`),
    updateThirdPartyVpnPeers: (organization_id, params) => rest.put(`/organizations/${organization_id}/thirdPartyVPNPeer`, params)
  };

  dashboard.phone_assignments = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneAssignments`),
    get: (network_id, serial) => rest.get(`/networks/${network_id}/phoneAssignments/${serial}`),
    assign: (network_id, serial, params) => rest.put(`/networks/${network_id}/phoneAssignments/${serial}`, params),
    delete: (network_id, serial) => rest.delete(`/networks/${network_id}/phoneAssignments/${serial}`),
  };

  dashboard.phone_contacts = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneContacts`),
    add: (network_id) => rest.post(`/networks/${network_id}/phoneContacts`),
    update: (network_id, contact_id, params) => rest.put(`/networks/${network_id}/phoneContacts/${contact_id}`, params),
    delete: (network_id, contact_id) => rest.delete(`/networks/${network_id}/phoneContacts/${contact_id}`)
  };

  dashboard.phone_numbers = {
    listAll: (network_id) => rest.get(`/networks/${network_id}/phoneNumbers`),
    listAvailable: (network_id) => rest.get(`/networks/${network_id}/phoneNumbers/available`)
  };

  dashboard.saml_roles = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/samlRoles`),
    get: (organization_id, role_id) => rest.get(`/organizations/${organization_id}/samlRoles/${role_id}`),
    update: (organization_id, role_id, params) => rest.put(`/organizations/${organization_id}/samlRoles/${role_id}`, params),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/samlRoles`, params),
    delete: (organization_id, role_id) => rest.delete(`/organizations/${organization_id}/samlRoles/${role_id}`),
  };

  dashboard.sm = {
    listDevices: (network_id) => rest.get(`/networks/${network_id}/sm/devices`),
    editTags: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/tags`, params),
    editFields: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/fields`, params),
    lockDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/lock`, params),
    wipeDevice: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/wipe`, params),
    forceCheckInDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/checkin`, params),
    moveDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/move`, params)
  };

  dashboard.ssids = {
    list: (network_id) => rest.get(`/networks/${network_id}/ssids`),
    get: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}`),
    update: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}`, params)
  };

  dashboard.static_routes = {
    list: (network_id) => rest.get(`/networks/${network_id}/staticRoutes`),
    get: (network_id, sr_id) => rest.get(`/networks/${network_id}/staticRoutes/${sr_id}`),
    update: (network_id, sr_id, params) => rest.put(`/networks/${network_id}/staticRoutes/${sr_id}`, params),
    add: (network_id, params) => rest.post(`/networks/${network_id}/staticRoutes`, params),
    delete: (network_id, sr_id) => rest.delete(`/networks/${network_id}/staticRoutes/${sr_id}`)
  };

  dashboard.switch_ports = {
    list: (serial) => rest.get(`/devices/${serial}/switchPorts`),
    get: (serial, port_number) => rest.get(`/devices/${serial}/switchPorts/${port_number}`),
    update: (serial, port_number, params) => rest.put(`/devices/${serial}/switchPorts/${port_number}`, params)
  };

  dashboard.vlans = {
    list: (network_id) => rest.get(`/networks/${network_id}/vlans`),
    get: (network_id, vlan_id) => rest.get(`/networks/${network_id}/vlans/${vlan_id}`),
    update: (network_id, vlan_id, params) => rest.put(`/networks/${network_id}/vlans/${vlan_id}`, params),
    add: (network_id, params) => rest.post(`/networks/${network_id}/vlans`, params),
    delete: (network_id, vlan_id) => rest.delete(`/networks/${network_id}/vlans/${vlan_id}`)
  };

  return dashboard;
}

module.exports = MerakiDashboard;