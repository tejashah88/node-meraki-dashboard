/* eslint-disable no-console */
'use strict';

const uniqueObjects = require('unique-objects');
const { table } = require('table');
const chalk = require('chalk');
const values = require('object.values');

const { retrieveOfficialDocs } = require('../utils/retrieve-api-routes');
const { getImplementedEndpoints } = require('../utils/code-analyzer');

const flatten = arr => [].concat(...arr);
const strEndpoint = endpoint => `${endpoint.method} - ${endpoint.path}`;

const METHOD_COLORS = {
  GET: chalk.blueBright,
  POST: chalk.greenBright,
  PUT: chalk.yellowBright,
  DELETE: chalk.redBright
};

const implEndpoints = getImplementedEndpoints('./src/index.js').map(strEndpoint);

console.log('Fetching endpoints...');
retrieveOfficialDocs()
  // fetch all endpoints
  .then(docs => flatten(values(docs)))
  // filter uniquely by method and path
  .then(combined => uniqueObjects(combined, ['method', 'path']))
  // filter out implemented endpoints
  .then(rawEndpoints => rawEndpoints.filter(endpoint => !implEndpoints.includes(strEndpoint(endpoint))))
  .then(endpointData => {
    const coloredEndpointData = endpointData.map(
      ({ group, method, path, description }) => ([
        group,
        METHOD_COLORS[method](method),
        path.replace(/<param>/g, chalk.cyanBright('<param>')),
        description.endsWith('.') ? description : description + '.'
      ])
    );

    let results;
    if (endpointData.length === 0)
      results = 'No missing API endpoints detected!';
    else {
      coloredEndpointData.sort((a, b) => {
        // sort by alphabetical descending order for the endpoint groups
        return a[0].localeCompare(b[0]);
      });

      const columnTitles = [ 'group', 'method', 'path', 'description'];
      results = `# of potentially unimplemented endpoints: ${endpointData.length}\n`;
      results += table([columnTitles, ...coloredEndpointData]);
    }

    console.log(results);
  });