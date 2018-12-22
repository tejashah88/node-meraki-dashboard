'use strict';

const axios = require('axios');
const jsonFromText = require('json-from-text');

const officialParamRegex =/(\[\w+\])/g;
const postmanParamRegex = /({{[\w-]+}})/g;

const officialDocsUrl = 'https://api.meraki.com/api_docs';
const postmanDocsUrl = 'https://documenter.getpostman.com/api/collections/897512/2To9xm?environment=897512-98a67320-8ab1-37f1-7a1e-9c29faa86c1d';

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
            source: 'official',
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

// NOTE: some if the code is for accounting for some of the bugs in the postman docs, which are documented here
// This method is really used b/c not all methods in the postman docs are in the official docs
function retrievePostmanDocs() {
  return axios.get(postmanDocsUrl)
    .then(res => res.data)
    .then(postman => {
      const finalPostman = {};

      postman.item.forEach(({ name: group, item: groupItem }) => {
        finalPostman[group] = groupItem.map(({ name: description, request }) => {
          const { path: pathParams } = request.urlObject;

          const path = '/' + [
            ...pathParams
              // some path params are missing, so we add a placeholder
              .map(param => param || '{{missing_param}}')
              // sometimes, there's an extra random ']' in some of the paths
              .map(param => param === ']' ? '{{missing_param}}' : param)
          ].join('/')
            .replace(postmanParamRegex, '<param>')
            .split('v0/') // some paths have an extra 'v0' in the postman docs
            .pop();
          return {
            source: 'postman',
            group, path, description,
            method: request.method
          };
        });
      });

      return finalPostman;
    });
}

module.exports = { retrieveOfficialDocs, retrievePostmanDocs };