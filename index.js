'use strict';
const axios = require('axios');

const ERRORS = {
  INVALID_API_KEY: 'Invalid API Key specified!'
};

let isDefined = value => typeof value !== "undefined";
let ensureValueVerbose = (testValue, truthyValue, falseyValue) => isDefined(testValue) ? truthyValue : falseyValue;
let ensureValue = (value, defaultVal) => ensureValueVerbose(value, value, defaultVal);

function MerakiDashboard(apiKey) {
  if (typeof apiKey !== 'string' || apiKey.length === 0)
    throw new Error(ERRORS.INVALID_API_KEY);

  let dashboard = {};

  let dataProcessor = response => response.data;
  let errorProcessor = response => {
    delete response.response.request;
    return Promise.reject(response.response);
  };

  let rest = {
    client: axios.create({
      baseURL: 'https://api.meraki.com/api/v0/',
      headers: {
        'X-Cisco-Meraki-API-Key': apiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      }
    }),
    get: function(url, parameters) {
      return this.client
        .get(url, { params: ensureValue(parameters, {}) })
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    post: function(url, parameters) {
      return this.client
        .post(url, ensureValue(parameters, {}))
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    put: function(url, parameters) {
      return this.client
        .put(url, ensureValue(parameters, {}))
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    delete: function(url) {
      return this.client
        .delete(url)
        .then(dataProcessor)
        .catch(errorProcessor);
    }
  };

  dashboard.admins = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/admins`),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/admins`, params),
    update: (organization_id, admin_id, params) => rest.put(`/organizations/${organization_id}/admins/${admin_id}`),
    revoke: (organization_id, admin_id) => rest.delete(`/organizations/${organization_id}/admins/${admin_id}`)
  };

  dashboard.clients = {
    list: (serial, timespan) => rest.get(`/devices/${serial}/clients`, ensureValueVerbose(timespan, { timespan }, {})),
    getPolicy: (network_id, client_mac, timespan) => rest.get(`/networks/${network_id}/clients/${client_mac}/policy`, ensureValueVerbose(timespan, { timespan }, {})),
    updatePolicy: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/policy`, params),
    getSplashAuth: (network_id, client_mac) => rest.get(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`),
    updateSplashAuth: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`, params)
  };

  dashboard.config_templates = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/configTemplates`),
    remove: (organization_id, template_id) => rest.delete(`/organizations/${organization_id}/configTemplates/${template_id}`)
  };

  dashboard.devices = {
    list: (network_id) => rest.get(`/networks/${network_id}/devices`),
    get: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}`),
    getUplinkInfo: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/uplink`),
    update: (network_id, serial, params) => rest.put(`/networks/${network_id}/devices/${serial}`, params),
    claim: (network_id, params) => rest.post(`/networks/${network_id}/devices/claim`, params),
    remove: (network_id, serial) => rest.post(`/networks/${network_id}/devices/${serial}/remove`),
    lldp_cdp_info: (network_id, serial, timespan) => rest.get(`/networks/${network_id}/devices/${serial}/lldp_cdp`, ensureValueVerbose(timespan, { timespan }, {}))
  };

  dashboard.group_policies = {
    list: (network_id) => rest.get(`/networks/${network_id}/groupPolicies`)
  };

  dashboard.hotspot_v2 = {
    getSettings: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}/hotspot20`),
    updateSettings: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/hotspot20`, params),
  }

  dashboard.mr_l3_firewall = {
    getRules: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`),
    updateRules: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`, params),
  };

  dashboard.mx_l3_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/l3FirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/l3FirewallRules`, params),
  };

  dashboard.mx_vpn_firewall = {
    getRules: (organization_id) => rest.get(`/organizations/${organization_id}/vpnFirewallRules`),
    updateRules: (organization_id, params) => rest.put(`/organizations/${organization_id}/vpnFirewallRules`, params),
  };

  dashboard.mx_cellular_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/cellularFirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/cellularFirewallRules`, params),
  }

  dashboard.networks = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/networks`),
    get: (network_id) => rest.get(`/networks/${network_id}`),
    update: (network_id, params) => rest.put(`/networks/${network_id}`, params),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/networks`, params),
    delete: (network_id) => rest.delete(`/networks/${network_id}`),
    bindToTemplate: (network_id) => rest.post(`/networks/${network_id}/bind`),
    unbindFromTemplate: (network_id) => rest.post(`/networks/${network_id}/unbind`),
    getSiteToSiteVpn: (network_id) => rest.get(`/networks/${network_id}/siteToSiteVpn`),
    updateSiteToSiteVpn: (network_id, params) => rest.put(`/networks/${network_id}/siteToSiteVpn`, params),
    getTrafficData: (network_id, params) => rest.get(`/networks/${network_id}/traffic`, params),
    listAccessPolicies: (network_id) => rest.get(`/networks/${network_id}/accessPolicies`),
    listAirMarshalScanResults: (network_id, timespan) => rest.get(`/networks/${network_id}/airMarshal`, ensureValueVerbose(timespan, { timespan }, {})),
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
    getThirdPartyVpnPeers: (organization_id) => rest.get(`/organizations/${organization_id}/thirdPartyVPNPeers`),
    updateThirdPartyVpnPeers: (organization_id, params) => rest.put(`/organizations/${organization_id}/thirdPartyVPNPeers`, params)
  };

  dashboard.phone_assignments = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneAssignments`),
    get: (network_id, serial) => rest.get(`/networks/${network_id}/phoneAssignments/${serial}`),
    assign: (network_id, serial, params) => rest.put(`/networks/${network_id}/phoneAssignments/${serial}`, params),
    delete: (network_id, serial) => rest.delete(`/networks/${network_id}/phoneAssignments/${serial}`),
  };

  dashboard.phone_callgroups = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneCallgroups`),
    get: (network_id, call_group_id) => rest.get(`/networks/${network_id}/phoneCallgroups/${call_group_id}`),
    create: (network_id, params) => rest.post(`/networks/${network_id}/phoneCallgroups`, params),
    update: (network_id, call_group_id, params) => rest.put(`/networks/${network_id}/phoneCallgroups/${call_group_id}`, params),
    delete: (network_id, call_group_id) => rest.delete(`/networks/${network_id}/phoneCallgroups/${call_group_id}`)
  }

  dashboard.phone_contacts = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneContacts`),
    add: (network_id, name) => rest.post(`/networks/${network_id}/phoneContacts`, ensureValueVerbose(name, { name }, {})),
    update: (network_id, contact_id, name) => rest.put(`/networks/${network_id}/phoneContacts/${contact_id}`, ensureValueVerbose(name, { name }, {})),
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
    cisco_clarity: {
      createProfile: (network_id, params) => rest.post(`/networks/${network_id}/sm/profile/clarity`, params),
      updateProfile: (network_id, profile_id, params) => rest.put(`/networks/${network_id}/sm/profile/clarity/${profile_id}`, params),
      addPayload: (network_id, profile_id, params) => rest.post(`/networks/${network_id}/sm/profile/clarity/${profile_id}`, params),
      getPayloadDetails: (network_id, profile_id) => rest.get(`/networks/${network_id}/sm/profile/clarity/${profile_id}`),
      deletePayload: (network_id, profile_id) => rest.delete(`/networks/${network_id}/sm/profile/clarity/${profile_id}`)
    },
    cisco_umbrella: {
      createProfile: (network_id, params) => rest.post(`/networks/${network_id}/sm/profile/umbrella`, params),
      updateProfile: (network_id, profile_id, params) => rest.put(`/networks/${network_id}/sm/profile/umbrella/${profile_id}`, params),
      addPayload: (network_id, profile_id, params) => rest.post(`/networks/${network_id}/sm/profile/umbrella/${profile_id}`, params),
      getPayloadDetails: (network_id, profile_id) => rest.get(`/networks/${network_id}/sm/profile/umbrella/${profile_id}`),
      deletePayload: (network_id, profile_id) => rest.delete(`/networks/${network_id}/sm/profile/umbrella/${profile_id}`)
    },
    cisco_polaris: {
      createApp: (network_id, params) => rest.post(`/networks/${network_id}/sm/app/polaris`, params),
      updateApp: (network_id, app_id, params) => rest.put(`/networks/${network_id}/sm/app/polaris/${app_id}`, params),
      getAppDetails: (network_id, bundle_id) => rest.get(`/networks/${network_id}/sm/app/polaris`, ensureValueVerbose(bundle_id, { bundleId: bundle_id }, {})),
      deleteApp: (network_id, app_id) => rest.delete(`/networks/${network_id}/sm/app/polaris/${app_id}`)
    },
    listDevices: (network_id) => rest.get(`/networks/${network_id}/sm/devices`),
    editTags: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/tags`, params),
    editFields: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/fields`, params),
    lockDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/lock`, params),
    wipeDevice: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/wipe`, params),
    forceCheckInDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/checkin`, params),
    moveDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/move`, params),
    listProfiles: (network_id) => rest.get(`/networks/${network_id}/sm/profiles`)
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

console.log(MerakiDashboard("teset"))