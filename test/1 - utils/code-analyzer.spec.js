'use strict';

const expect = require('chai').expect;
const { getImplementedEndpoints } = require('../../utils/code-analyzer');

describe('utils/code-analyzer.js', function () {
  before(function () {
    this.apiPaths = getImplementedEndpoints('./src/index.js');
  });

  it('should have a defined method and path', function () {
    const validPaths = this.apiPaths.filter(endpoint => endpoint.method && endpoint.path);
    expect(validPaths).to.be.length(this.apiPaths.length);
  });
});