/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const uniqueObjects = require('unique-objects');
const { table } = require('table');
const chalk = require('chalk');

const values = require('object.values');

const blacklistedEndpointsPath = __dirname + '/postman-endpoint-blacklist.json';

const { retrieveOfficialDocs, retrievePostmanDocs } = require('../utils/retrieve-api-routes');
const getImplementedPaths = require('../utils/code-analyzer');

const flatten = arr => [].concat(...arr);
const getAllEndpoints = docs => flatten(values(docs));
const stringifyEndpoint = endpoint => `${endpoint.method} - ${endpoint.path}`;

const implEndpoints = getImplementedPaths('./src/index.js')
  .map(({ method, path }) => ({ method, path }));
const implEndpointsInfo = implEndpoints.map(stringifyEndpoint);

const argv = require('minimist')(process.argv.slice(2), { boolean: true });

// the order of how the docs are positioned is important, since the official docs should have
// more priority over the postman docs
Promise.all([
  retrievePostmanDocs().then(getAllEndpoints),
  retrieveOfficialDocs().then(getAllEndpoints)
]).then(arrays => flatten(arrays))
  .then(combined => uniqueObjects(combined, ['method', 'path']))
  .then(allEndpoints => {
    let endpointData = allEndpoints.filter(
      endpoint => !implEndpointsInfo.includes(stringifyEndpoint(endpoint))
    );

    let postmanBlacklist = [];
    if (argv['disable-blacklist'] || argv['save-blacklist']) {
      console.log('Ignoring blacklist...');
    } else {
      console.log('Reading from blacklist...');

      if (fs.existsSync(blacklistedEndpointsPath)) {
        postmanBlacklist = JSON.parse(fs.readFileSync(blacklistedEndpointsPath, 'utf-8'));
        console.log('Done');
      } else {
        console.log('Unable to locate blacklist. It will be generated!');
      }

      console.log();
    }

    const prettyPostmanBlacklist = postmanBlacklist.map(stringifyEndpoint);
    endpointData = endpointData.filter(
      endpoint => !prettyPostmanBlacklist.includes(stringifyEndpoint(endpoint))
    );

    const coloredEndpointData = endpointData.map(({ source, group, method, path }) => {
      const sourceColor = source === 'official' ? chalk.greenBright : chalk.redBright;
      const METHOD_COLORS = { GET: chalk.blueBright, POST: chalk.greenBright, PUT: chalk.yellowBright, DELETE: chalk.redBright };
      const methodColor = METHOD_COLORS[method];
      return [
        sourceColor(source),
        group,
        methodColor(method),
        path.replace(/<param>/g, chalk.cyanBright('<param>'))
      ];
    });

    let results;
    if (endpointData.length === 0)
      results = 'No missing API endpoints detected!';
    else {
      coloredEndpointData.sort((a, b) => {
        // sort by descending order for the sources and by ascending order for the groups
        const computedStrA = `${a[0]} - ${b[1]}`;
        const computedStrB = `${b[0]} - ${a[1]}`;
        return computedStrB.localeCompare(computedStrA);
      });

      const columnTitles = ['source', 'group', 'method', 'path'];
      results = `# of potentially unimplemented endpoints: ${endpointData.length}\n`;
      results += table([columnTitles, ...coloredEndpointData]);
    }

    console.log(results);

    if (argv['save-blacklist']) {
      console.log('Saving detected postman endpoints to blacklist...');
      postmanBlacklist = endpointData
        .filter(endpoint => endpoint.source === 'postman')
        .map(({ method, path }) => ({ method, path }));

      fs.writeFileSync(blacklistedEndpointsPath, JSON.stringify(postmanBlacklist, null, 2), 'utf-8');
      console.log('Done!');
    }
  });