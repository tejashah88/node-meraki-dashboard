'use strict';

const axios = require('axios');
const JSONbig = require('json-bigint');
const ERRORS = { INVALID_API_KEY: 'Invalid API Key specified!' };

const ensureValueVerbose = (testVal, truthyVal, falseyVal) => typeof testVal !== 'undefined' ? truthyVal : falseyVal;

function MerakiDashboard(apiKey) {
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0)
    throw new Error(ERRORS.INVALID_API_KEY);

  apiKey = apiKey.trim();

  const dashboard = {};

  const dataProcessor = response => response.data;
  const errorProcessor = response => {
    delete response.response.request;
    return Promise.reject(response.response);
  };

  const rest = {
    client: axios.create({
      baseURL: 'https://api.meraki.com/api/v0/',
      headers: {
        'X-Cisco-Meraki-API-Key': apiKey,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      transformResponse: [ JSONbig.parse ]
    }),
    get: function(url, params) {
      return this.client.get(url, { params })
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    post: function(url, params) {
      return this.client.post(url, params)
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    put: function(url, params) {
      return this.client.put(url, params)
        .then(dataProcessor)
        .catch(errorProcessor);
    },
    delete: function(url) {
      return this.client.delete(url)
        .then(dataProcessor)
        .catch(errorProcessor);
    }
  };

  dashboard.api_usage = {
    api_requests: (organization_id, params) => rest.get(`/organizations/${organization_id}/apiRequests`, params)
  };

  dashboard.admins = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/admins`),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/admins`, params),
    update: (organization_id, admin_id, params) => rest.put(`/organizations/${organization_id}/admins/${admin_id}`, params),
    revoke: (organization_id, admin_id) => rest.delete(`/organizations/${organization_id}/admins/${admin_id}`)
  };

  dashboard.alert_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/alertSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/alertSettings`, params)
  };

  dashboard.action_batches = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/actionBatches`),
    get: (organization_id, action_batch_id) => rest.get(`/organizations/${organization_id}/actionBatches/${action_batch_id}`),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/actionBatches`, params),
    update: (organization_id, action_batch_id, params) => rest.put(`/organizations/${organization_id}/actionBatches/${action_batch_id}`, params),
    delete: (organization_id, action_batch_id) => rest.delete(`/organizations/${organization_id}/actionBatches/${action_batch_id}`)
  };

  dashboard.bluetooth_clients = {
    list: (network_id, params) => rest.get(`/networks/${network_id}/bluetoothClients`, params),
    get: (network_id, client_mac, params) => rest.get(`/networks/${network_id}/bluetoothClients/${client_mac}`, params)
  };

  dashboard.cameras = {
    videoLink: (network_id, serial, timestamp) => rest.get(`/networks/${network_id}/cameras/${serial}/videoLink`, ensureValueVerbose(timestamp, { timestamp }, {})),
    snapshot: (network_id, serial, timestamp) => rest.post(`/networks/${network_id}/cameras/${serial}/snapshot`, ensureValueVerbose(timestamp, { timestamp }, {}))
  };

  dashboard.clients = {
    list: (serial, timespan) => rest.get(`/devices/${serial}/clients`, ensureValueVerbose(timespan, { timespan }, {})),
    get: (network_id, client_id_or_mac_or_ip) => rest.get(`/networks/${network_id}/clients/${client_id_or_mac_or_ip}`),
    provision: (network_id, params) => rest.post(`/networks/${network_id}/clients/provision`, params),
    usageHistory: (network_id, client_id_or_mac_or_ip) => rest.get(`/networks/${network_id}/clients/${client_id_or_mac_or_ip}/usageHistory`),
    trafficHistory: (network_id, client_id_or_mac_or_ip, params) => rest.get(`/networks/${network_id}/clients/${client_id_or_mac_or_ip}/trafficHistory`, params),
    events: (network_id, client_id_or_mac_or_ip, params) => rest.get(`/networks/${network_id}/clients/${client_id_or_mac_or_ip}/events`, params),
    latencyHistory: (network_id, client_id_or_mac_or_ip, params) => rest.get(`/networks/${network_id}/clients/${client_id_or_mac_or_ip}/latencyHistory`, params),
    securityEvents: (network_id, client_id, params) => rest.get(`/networks/${network_id}/clients/${client_id}/securityEvents`, params),
    getPolicy: (network_id, client_mac, timespan) => rest.get(`/networks/${network_id}/clients/${client_mac}/policy`, ensureValueVerbose(timespan, { timespan }, {})),
    updatePolicy: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/policy`, params),
    getSplashAuth: (network_id, client_mac) => rest.get(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`),
    updateSplashAuth: (network_id, client_mac, params) => rest.put(`/networks/${network_id}/clients/${client_mac}/splashAuthorizationStatus`, params),
    usedNetwork: (network_id, params) => rest.get(`/networks/${network_id}/clients`, params)
  };

  dashboard.config_templates = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/configTemplates`),
    remove: (organization_id, template_id) => rest.delete(`/organizations/${organization_id}/configTemplates/${template_id}`)
  };

  dashboard.content_filtering = {
    categories: {
      get: (network_id) => rest.get(`/networks/${network_id}/contentFiltering/categories`)
    },
    rules: {
      get: (network_id) => rest.get(`/networks/${network_id}/contentFiltering`),
      update: (network_id, params) => rest.put(`/networks/${network_id}/contentFiltering`, params)
    }
  };

  dashboard.devices = {
    listByOrganization: (organization_id, params) => rest.get(`/organizations/${organization_id}/devices`, params),
    listByNetwork: (network_id) => rest.get(`/networks/${network_id}/devices`),
    get: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}`),
    getUplinkInfo: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/uplink`),
    update: (network_id, serial, params) => rest.put(`/networks/${network_id}/devices/${serial}`, params),
    claim: (network_id, params) => rest.post(`/networks/${network_id}/devices/claim`, params),
    remove: (network_id, serial) => rest.post(`/networks/${network_id}/devices/${serial}/remove`),
    lldpCdpInfo: (network_id, serial, timespan) => rest.get(`/networks/${network_id}/devices/${serial}/lldp_cdp`, ensureValueVerbose(timespan, { timespan }, {})),
    lossAndLatencyHistory: (network_id, serial, params) => rest.get(`/networks/${network_id}/devices/${serial}/lossAndLatencyHistory`, params),
    performanceScore: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/performance`),
    blinkLeds: (network_id, serial, params) => rest.post(`/networks/${network_id}/devices/${serial}/blinkLeds`, params),
    reboot: (network_id, serial) => rest.post(`/networks/${network_id}/devices/${serial}/reboot`)
  };

  dashboard.firewalled_services = {
    list: (network_id) => rest.get(`/networks/${network_id}/firewalledServices`),
    get: (network_id, service) => rest.get(`/networks/${network_id}/firewalledServices/${service}`),
    update: (network_id, service, params) => rest.put(`/networks/${network_id}/firewalledServices/${service}`, params)
  };

  dashboard.group_policies = {
    list: (network_id) => rest.get(`/networks/${network_id}/groupPolicies`),
    get: (network_id, group_policy_id) => rest.get(`/networks/${network_id}/groupPolicies/${group_policy_id}`),
    create: (network_id, params) => rest.post(`/networks/${network_id}/groupPolicies`, params),
    update: (network_id, group_policy_id, params) => rest.put(`/networks/${network_id}/groupPolicies/${group_policy_id}`, params),
    delete: (network_id, group_policy_id) => rest.delete(`/networks/${network_id}/groupPolicies/${group_policy_id}`),
  };

  dashboard.http_servers = {
    list: (network_id) => rest.get(`/networks/${network_id}/httpServers`),
    get: (network_id, server_id) => rest.get(`/networks/${network_id}/httpServers/${server_id}`),
    update: (network_id, server_id, params) => rest.put(`/networks/${network_id}/httpServers/${server_id}`, params),
    create: (network_id, params) => rest.post(`/networks/${network_id}/httpServers`, params),
    delete: (network_id, server_id) => rest.delete(`/networks/${network_id}/httpServers/${server_id}`),
    test: (network_id, url) => rest.post(`/networks/${network_id}/httpServers/webhookTests`, ensureValueVerbose(url, { url }, {})),
    testStatus: (network_id, test_id) => rest.get(`/networks/${network_id}/httpServers/webhookTests/${test_id}`)
  };

  dashboard.intrusion_settings = {
    organization: {
      get: (organization_id) => rest.get(`/organizations/${organization_id}/security/intrusionSettings`),
      update: (organization_id, params) => rest.put(`/organizations/${organization_id}/security/intrusionSettings`, params),
    },
    mx_network: {
      get: (network_id) => rest.get(`/networks/${network_id}/security/intrusionSettings`),
      update: (network_id, params) => rest.put(`/networks/${network_id}/security/intrusionSettings`, params),
    },
  };

  dashboard.malware_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/security/malwareSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/security/malwareSettings`, params)
  };

  dashboard.management_settings = {
    get: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/managementInterfaceSettings`),
    update: (network_id, serial, params) => rest.put(`/networks/${network_id}/devices/${serial}/managementInterfaceSettings`, params)
  };

  dashboard.meraki_auth = {
    listUsers: (network_id) => rest.get(`/networks/${network_id}/merakiAuthUsers`),
    getUser: (network_id, user_id) => rest.get(`/networks/${network_id}/merakiAuthUsers/${user_id}`)
  };

  dashboard.mr_l3_firewall = {
    getRules: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`),
    updateRules: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/l3FirewallRules`, params)
  };

  dashboard.mv_sense = {
    overview: (serial) => rest.get(`/devices/${serial}/camera/analytics/overview`),
    zones: (serial) => rest.get(`/devices/${serial}/camera/analytics/zones`),
    historicalRecords: (serial, zone_id, params) => rest.get(`/devices/${serial}/camera/analytics/zones/${zone_id}/history`, params),
    recentRecords: (serial) => rest.get(`/devices/${serial}/camera/analytics/recent`),
    liveRecords: (serial) => rest.get(`/devices/${serial}/camera/analytics/live`)
  };

  dashboard.mx_nat_rules = {
    one_to_one: {
      get: (network_id) => rest.get(`/networks/${network_id}/oneToOneNatRules`),
      update: (network_id, params) => rest.put(`/networks/${network_id}/oneToOneNatRules`, params),
    },
    one_to_many: {
      get: (network_id) => rest.get(`/networks/${network_id}/oneToManyNatRules`),
      update: (network_id, params) => rest.put(`/networks/${network_id}/oneToManyNatRules`, params),
    },
  };

  dashboard.mx_l3_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/l3FirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/l3FirewallRules`, params)
  };

  dashboard.mx_l7_app_categories = {
    list: (network_id) => rest.get(`/networks/${network_id}/l7FirewallRules/applicationCategories`)
  };

  dashboard.mx_l7_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/l7FirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/l7FirewallRules`, params)
  };

  dashboard.mx_vpn_firewall = {
    getRules: (organization_id) => rest.get(`/organizations/${organization_id}/vpnFirewallRules`),
    updateRules: (organization_id, params) => rest.put(`/organizations/${organization_id}/vpnFirewallRules`, params)
  };

  dashboard.mx_cellular_firewall = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/cellularFirewallRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/cellularFirewallRules`, params),
  };

  dashboard.mx_port_forwarding = {
    getRules: (network_id) => rest.get(`/networks/${network_id}/portForwardingRules`),
    updateRules: (network_id, params) => rest.put(`/networks/${network_id}/portForwardingRules`, params)
  };

  dashboard.named_tag_scope = {
    list: (network_id, with_details) => rest.get(`/networks/${network_id}/sm/targetGroups`, ensureValueVerbose(with_details, { withDetails: with_details }, {})),
    get: (network_id, named_tag_scope_id, with_details) => rest.get(`/networks/${network_id}/sm/targetGroups/${named_tag_scope_id}`, ensureValueVerbose(with_details, { withDetails: with_details }, {})),
    update: (network_id, named_tag_scope_id, params) => rest.put(`/networks/${network_id}/sm/targetGroups/${named_tag_scope_id}`, params),
    create: (network_id, params) => rest.post(`/networks/${network_id}/sm/targetGroups`, params),
    delete: (network_id, named_tag_scope_id) => rest.delete(`/networks/${network_id}/sm/targetGroups/${named_tag_scope_id}`)
  };

  dashboard.netflow_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/netflowSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/netflowSettings`, params)
  };

  dashboard.networks = {
    list: (organization_id) => rest.get(`/organizations/${organization_id}/networks`),
    get: (network_id) => rest.get(`/networks/${network_id}`),
    update: (network_id, params) => rest.put(`/networks/${network_id}`, params),
    create: (organization_id, params) => rest.post(`/organizations/${organization_id}/networks`, params),
    delete: (network_id) => rest.delete(`/networks/${network_id}`),
    bindToTemplate: (network_id, params) => rest.post(`/networks/${network_id}/bind`, params),
    unbindFromTemplate: (network_id) => rest.post(`/networks/${network_id}/unbind`),
    getSiteToSiteVpn: (network_id) => rest.get(`/networks/${network_id}/siteToSiteVpn`),
    updateSiteToSiteVpn: (network_id, params) => rest.put(`/networks/${network_id}/siteToSiteVpn`, params),
    getTrafficData: (network_id, params) => rest.get(`/networks/${network_id}/traffic`, params),
    listAccessPolicies: (network_id) => rest.get(`/networks/${network_id}/accessPolicies`),
    listAirMarshalScanResults: (network_id, timespan) => rest.get(`/networks/${network_id}/airMarshal`, ensureValueVerbose(timespan, { timespan }, {})),
    getBluetoothSettings: (network_id) => rest.get(`/networks/${network_id}/bluetoothSettings`),
    updateBluetoothSettings: (network_id, params) => rest.put(`/networks/${network_id}/bluetoothSettings`, params),
    combineNetworks: (organization_id, params) => rest.post(`/organizations/${organization_id}/networks/combine`, params),
    splitNetwork: (network_id) => rest.post(`/networks/${network_id}/split`)
  };

  dashboard.openapi_spec = {
    get: (organization_id) => rest.get(`/organizations/${organization_id}/openapiSpec`)
  };

  dashboard.organizations = {
    list: () => rest.get(`/organizations`),
    get: (organization_id) => rest.get(`/organizations/${organization_id}`),
    create: (params) => rest.post(`/organizations`, params),
    update: (organization_id, params) => rest.put(`/organizations/${organization_id}`, params),
    delete: (organization_id) => rest.delete(`/organizations/${organization_id}`),
    clone: (organization_id, params) => rest.post(`/organizations/${organization_id}/clone`, params),
    claimDevice: (organization_id, params) => rest.post(`/organizations/${organization_id}/claim`, params),
    getLicenseState: (organization_id) => rest.get(`/organizations/${organization_id}/licenseState`),
    getInventory: (organization_id) => rest.get(`/organizations/${organization_id}/inventory`),
    getDeviceStatuses: (organization_id) => rest.get(`/organizations/${organization_id}/deviceStatuses`),
    getSnmpSettings: (organization_id) => rest.get(`/organizations/${organization_id}/snmp`),
    updateSnmpSettings: (organization_id, params) => rest.put(`/organizations/${organization_id}/snmp`, params),
    getUplinkLossLatency: (organization_id, params) => rest.get(`/organizations/${organization_id}/uplinksLossAndLatency`, params),
    getThirdPartyVpnPeers: (organization_id) => rest.get(`/organizations/${organization_id}/thirdPartyVPNPeers`),
    updateThirdPartyVpnPeers: (organization_id, params) => rest.put(`/organizations/${organization_id}/thirdPartyVPNPeers`, params)
  };

  dashboard.phone_announcements = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneAnnouncements`),
    add: (network_id, name) => rest.post(`/networks/${network_id}/phoneAnnouncements`, ensureValueVerbose(name, { name }, {})),
    delete: (network_id, group_id) => rest.delete(`/networks/${network_id}/phoneAnnouncements/${group_id}`)
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
  };

  dashboard.phone_comference_rooms = {
    list: (network_id) => rest.get(`/networks/${network_id}/phoneConferenceRooms`),
    get: (network_id, room_id) => rest.get(`/networks/${network_id}/phoneConferenceRooms/${room_id}`),
    create: (network_id, params) => rest.post(`/networks/${network_id}/phoneConferenceRooms`, params),
    update: (network_id, room_id, params) => rest.put(`/networks/${network_id}/phoneConferenceRooms/${room_id}`, params),
    delete: (network_id, room_id) => rest.delete(`/networks/${network_id}/phoneConferenceRooms/${room_id}`)
  };

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

  dashboard.pii = {
    organizations: {
      list: (organization_id, params) => rest.get(`/organizations/${organization_id}/pii/piiKeys`, params),
      getDeviceId: (organization_id, params) => rest.get(`/organizations/${organization_id}/pii/smDevicesForKey`, params),
      listSMOwners: (organization_id, params) => rest.get(`/organizations/${organization_id}/pii/smOwnersForKey`, params),
      listRequests: (organization_id) => rest.get(`/organizations/${organization_id}/pii/requests`),
      getRequest: (organization_id, request_id) => rest.get(`/organizations/${organization_id}/pii/requests/${request_id}`),
      submitRequest: (organization_id, params) => rest.post(`/organizations/${organization_id}/pii/requests`, params),
      deleteRequest: (organization_id, request_id) => rest.delete(`/organizations/${organization_id}/pii/requests/${request_id}`),
    },
    networks: {
      list: (network_id, params) => rest.get(`/networks/${network_id}/pii/piiKeys`, params),
      getDeviceId: (network_id, params) => rest.get(`/networks/${network_id}/pii/smDevicesForKey`, params),
      listSMOwners: (network_id, params) => rest.get(`/networks/${network_id}/pii/smOwnersForKey`, params),
      listRequests: (network_id) => rest.get(`/networks/${network_id}/pii/requests`),
      getRequest: (network_id, request_id) => rest.get(`/networks/${network_id}/pii/requests/${request_id}`),
      submitRequest: (network_id, params) => rest.post(`/networks/${network_id}/pii/requests`, params),
      deleteRequest: (network_id, request_id) => rest.delete(`/networks/${network_id}/pii/requests/${request_id}`),
    }
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
    device: {
      networkAdapters: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/networkAdapters`),
      wlanLists: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/wlanLists`),
      securityCenters: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/securityCenters`),
      restrictions: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/restrictions`),
      certs: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/certs`),
      cellularUsage: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/cellularUsageHistory`),
      performanceHistory: (network_id, device_id, params) => rest.get(`/networks/${network_id}/sm/${device_id}/performanceHistory`, params),
      desktopLogs: (network_id, device_id, params) => rest.get(`/networks/${network_id}/sm/${device_id}/desktopLogs`, params),
      commandLogs: (network_id, device_id, params) => rest.get(`/networks/${network_id}/sm/${device_id}/deviceCommandLogs`, params),
      connectivityHistory: (network_id, device_id, params) => rest.get(`/networks/${network_id}/sm/${device_id}/connectivity`, params),
      unenroll: (network_id, device_id) => rest.post(`/networks/${network_id}/sm/devices/${device_id}/unenroll`)
    },
    listDevices: (network_id) => rest.get(`/networks/${network_id}/sm/devices`),
    listOwners: (network_id, params) => rest.get(`/networks/${network_id}/sm/users`, params),
    listProfilesByUser: (network_id, user_id) => rest.get(`/networks/${network_id}/sm/user/${user_id}/deviceProfiles`),
    listProfilesByDevice: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/deviceProfiles`),
    listSoftwareByUser: (network_id, user_id) => rest.get(`/networks/${network_id}/sm/user/${user_id}/softwares`),
    listSoftwareByDevice: (network_id, device_id) => rest.get(`/networks/${network_id}/sm/${device_id}/softwares`),
    editTags: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/tags`, params),
    editFields: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/fields`, params),
    lockDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/lock`, params),
    wipeDevice: (network_id, params) => rest.put(`/networks/${network_id}/sm/device/wipe`, params),
    forceCheckInDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/checkin`, params),
    moveDevices: (network_id, params) => rest.put(`/networks/${network_id}/sm/devices/move`, params),
    listProfiles: (network_id) => rest.get(`/networks/${network_id}/sm/profiles`),
    bypassLockAttempt: (network_id, ids) => rest.post(`/networks/${network_id}/sm/bypassActivationLockAttempts`, ensureValueVerbose(ids, { ids }, {})),
    bypassLockAttemptStatus: (network_id, attempt_id) => rest.get(`/networks/${network_id}/sm/bypassActivationLockAttempts/${attempt_id}`)
  };

  dashboard.radio_settings = {
    get: (network_id, serial) => rest.get(`/networks/${network_id}/devices/${serial}/wireless/radioSettings`),
    update: (network_id, serial, params) => rest.put(`/networks/${network_id}/devices/${serial}/wireless/radioSettings`, params),
    listRfProfiles: (network_id, params) => rest.get(`/networks/${network_id}/wireless/rfProfiles`, params)
  };

  dashboard.snmp_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/snmpSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/snmpSettings`, params)
  };

  dashboard.ssids = {
    list: (network_id) => rest.get(`/networks/${network_id}/ssids`),
    get: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}`),
    update: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}`, params)
  };

  dashboard.security_events = {
    byOrganization: (organization_id, params) => rest.get(`/organizations/${organization_id}/securityEvents`, params),
    byNetwork: (network_id, params) => rest.get(`/networks/${network_id}/securityEvents`, params)
  };

  dashboard.splash_page = {
    loginAttempts: (network_id, params) => rest.get(`/networks/${network_id}/splashLoginAttempts`, params),
    getSettings: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}/splashSettings`),
    updateSettings: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/splashSettings`, params)
  };

  dashboard.static_routes = {
    list: (network_id) => rest.get(`/networks/${network_id}/staticRoutes`),
    get: (network_id, sr_id) => rest.get(`/networks/${network_id}/staticRoutes/${sr_id}`),
    update: (network_id, sr_id, params) => rest.put(`/networks/${network_id}/staticRoutes/${sr_id}`, params),
    add: (network_id, params) => rest.post(`/networks/${network_id}/staticRoutes`, params),
    delete: (network_id, sr_id) => rest.delete(`/networks/${network_id}/staticRoutes/${sr_id}`)
  };

  dashboard.switch_port_schedules = {
    list: (network_id) => rest.get(`/networks/${network_id}/switch/portSchedules`)
  };

  dashboard.switch_ports = {
    list: (serial) => rest.get(`/devices/${serial}/switchPorts`),
    get: (serial, port_number) => rest.get(`/devices/${serial}/switchPorts/${port_number}`),
    update: (serial, port_number, params) => rest.put(`/devices/${serial}/switchPorts/${port_number}`, params)
  };

  dashboard.switch_profiles = {
    list: (organization_id, config_template_id) => rest.get(`/organizations/${organization_id}/configTemplates/${config_template_id}/switchProfiles`)
  };

  dashboard.switch_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/switch/settings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/switch/settings`, params)
  };

  dashboard.switch_stacks = {
    list: (network_id) => rest.get(`/networks/${network_id}/switchStacks`),
    get: (network_id, switch_stack_id) => rest.get(`/networks/${network_id}/switchStacks/${switch_stack_id}`),
    create: (network_id, params) => rest.post(`/networks/${network_id}/switchStacks`, params),
    add: (network_id, switch_stack_id, serial) => rest.post(`/networks/${network_id}/switchStacks/${switch_stack_id}/add`, ensureValueVerbose(serial, { serial }, {})),
    remove: (network_id, switch_stack_id, serial) => rest.post(`/networks/${network_id}/switchStacks/${switch_stack_id}/remove`, ensureValueVerbose(serial, { serial }, {})),
    delete: (network_id, switch_stack_id) => rest.delete(`/networks/${network_id}/switchStacks/${switch_stack_id}`)
  };

  dashboard.syslog_servers = {
    list: (network_id) => rest.get(`/networks/${network_id}/syslogServers`),
    update: (network_id, servers) => rest.put(`/networks/${network_id}/syslogServers`, ensureValueVerbose(servers, { servers }, {}))
  };

  dashboard.traffic_analysis_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/trafficAnalysisSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/trafficAnalysisSettings`, params)
  };

  dashboard.traffic_shaping = {
    network_settings: {
      get: (network_id) => rest.get(`/networks/${network_id}/trafficShaping`),
      update: (network_id, params) => rest.put(`/networks/${network_id}/trafficShaping`, params),
    },
    ssid_settings: {
      get: (network_id, ssid) => rest.get(`/networks/${network_id}/ssids/${ssid}/trafficShaping`),
      update: (network_id, ssid, params) => rest.put(`/networks/${network_id}/ssids/${ssid}/trafficShaping`, params),
    },
    dscpTaggingOptions: (network_id) => rest.get(`/networks/${network_id}/trafficShaping/dscpTaggingOptions`),
    applicationCategories: (network_id) => rest.get(`/networks/${network_id}/trafficShaping/applicationCategories`)
  };

  dashboard.uplink_settings = {
    get: (network_id) => rest.get(`/networks/${network_id}/uplinkSettings`),
    update: (network_id, params) => rest.put(`/networks/${network_id}/uplinkSettings`, params)
  };

  dashboard.vlans = {
    list: (network_id) => rest.get(`/networks/${network_id}/vlans`),
    get: (network_id, vlan_id) => rest.get(`/networks/${network_id}/vlans/${vlan_id}`),
    update: (network_id, vlan_id, params) => rest.put(`/networks/${network_id}/vlans/${vlan_id}`, params),
    add: (network_id, params) => rest.post(`/networks/${network_id}/vlans`, params),
    delete: (network_id, vlan_id) => rest.delete(`/networks/${network_id}/vlans/${vlan_id}`),
    isEnabled: (network_id) => rest.get(`/networks/${network_id}/vlansEnabledState`),
    setEnabled: (network_id, enabled) => rest.put(`/networks/${network_id}/vlansEnabledState`, ensureValueVerbose(enabled, { enabled }, {})),
  };

  dashboard.webhook_logs = {
    get: (organization_id, params) => rest.get(`/organizations/${organization_id}/webhookLogs`, params)
  };

  dashboard.wireless_health = {
    connectivity_info: {
      general: (network_id, params) => rest.get(`/networks/${network_id}/connectionStats`, params),
      groupByNode: (network_id, params) => rest.get(`/networks/${network_id}/devices/connectionStats`, params),
      forAP: (network_id, serial, params) => rest.get(`/networks/${network_id}/devices/${serial}/connectionStats`, params),
      groupByClient: (network_id, params) => rest.get(`/networks/${network_id}/clients/connectionStats`, params),
      forClient: (network_id, client_id, params) => rest.get(`/networks/${network_id}/clients/${client_id}/connectionStats`, params)
    },
    latency_info: {
      general: (network_id, params) => rest.get(`/networks/${network_id}/latencyStats`, params),
      groupByNode: (network_id, params) => rest.get(`/networks/${network_id}/devices/latencyStats`, params),
      forAP: (network_id, serial, params) => rest.get(`/networks/${network_id}/devices/${serial}/latencyStats`, params),
      groupByClient: (network_id, params) => rest.get(`/networks/${network_id}/clients/latencyStats`, params),
      forClient: (network_id, client_id, params) => rest.get(`/networks/${network_id}/clients/${client_id}/latencyStats`, params)
    },
    failed_events: (network_id, params) => rest.get(`/networks/${network_id}/failedConnections`, params)
  };

  dashboard.custom = {
    head: url => rest.head(url),
    get: (url, parameters) => rest.get(url, parameters),
    post: (url, parameters) => rest.post(url, parameters),
    put: (url, parameters) => rest.put(url, parameters),
    delete: url => rest.delete(url)
  };

  return dashboard;
}

module.exports = MerakiDashboard;