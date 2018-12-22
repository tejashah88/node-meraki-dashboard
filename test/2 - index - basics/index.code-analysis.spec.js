'use strict';

const matchAll = require('string.prototype.matchall');

const expect = require('chai').expect;
const getImplementedPaths = require('../../utils/code-analyzer');
const DEFINED_API_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const unique = arr => [...new Set(arr)];

describe('code structure analysis tests', function () {
  before(function () {
    this.apiPaths = getImplementedPaths('./src/index.js');
  });

  it('should have valid REST methods implemented', function () {
    const invalidPaths = this.apiPaths.filter(endpoint => !DEFINED_API_METHODS.includes(endpoint.method));
    const invalidMethods = unique(invalidPaths.map(endpoint => endpoint.method));
    expect(invalidPaths).to.be.length(0, `Invalid REST methods detected: [ ${invalidMethods.join(', ')} ]`);
  });

  it('should have the path formed properly, with path parameters isolated from normal words', function () {
    for (const endpoint of this.apiPaths) {
      const pathParts = endpoint.path.split('/').slice(1); // we omit the first element since it will be blank
      const invalidParts = pathParts
        .map(part => [...matchAll(part, /\w+/g)][0]) // find all wordlike objects
        .filter(({ 0: match, input }) => {
          if (match === 'param') // we are expecting the input to be <param>
            return input !== '<param>';
          else // we are expecting the original input to equal whatever was matched
            return input !== match;
        })
        .map(result => result.input);

      expect(invalidParts).to.be.length(
        0, `Invalid path parts detected: [ ${invalidParts.join(', ')} ] in path '${endpoint.path}'`
      );
    }
  });
});