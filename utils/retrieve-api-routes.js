'use strict';

const axios = require('axios');
const jsonFromText = require('json-from-text');

const officialParamRegex =/([\[\{]\w+[\}\]])/g;
const officialDocsUrl = 'https://api.meraki.com/api_docs';

function retrieveOfficialDocs() {
  return axios.get(officialDocsUrl)
    .then(res => res.data)
    .then(official => {
      // we need to extract the embedded json in the retrieved HTML page, in which we'll use the 'json-from-text' module
      const semiOfficial = jsonFromText(official, false).jsonResults;
      // extract the biggest JSON blob (which is most likely the target JSON we are looking for) and parse it into an object
      const almostOfficial = JSON.parse(semiOfficial.sort((a, b) => b.length - a.length)[0]);
      const finalOfficial = {};

      Object.keys(almostOfficial).forEach(group => {
        finalOfficial[group] = almostOfficial[group].map(({
          http_method: method,
          path, alternate_path,
          description, params
        }) => {
          if (path.endsWith('/'))
            path = path.slice(0, path.length - 1);

          return {
            group, method, description,
            path: path.replace(officialParamRegex, '<param>'),
            alt_path: alternate_path ? alternate_path.replace(officialParamRegex, '<param>') : null,
            params: params || null
          };
        });
      });

      return finalOfficial;
    });
}

module.exports = { retrieveOfficialDocs };