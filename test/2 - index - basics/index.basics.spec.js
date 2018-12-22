'use strict';

const MerakiDashboard = require('../../src/index');
const expect = require('chai').expect;

describe('basic structure of client library', function () {
  it('should have a constructor that is a normal function', function() {
    expect(MerakiDashboard).to.be.a('function');
  });

  it('should return an object when you initialize it', function() {
    expect(MerakiDashboard('example-key')).to.be.an('object');
  });

  it('should fail if not given anything (null or undefined) for the api key', function () {
    const expectedErrorMsg = 'Invalid API Key specified!';
    expect(() => MerakiDashboard()).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard(undefined)).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard(null)).to.throw(expectedErrorMsg);
  });

  it('should fail if not given a string for the api key', function () {
    const expectedErrorMsg = 'Invalid API Key specified!';
    expect(() => MerakiDashboard(123)).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard({ apikey: 'example-key' })).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard(['example-key'])).to.throw(expectedErrorMsg);
  });

  it('should fail if given a string with various whitespace', function () {
    const expectedErrorMsg = 'Invalid API Key specified!';
    expect(() => MerakiDashboard('')).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard('    ')).to.throw(expectedErrorMsg);
    expect(() => MerakiDashboard('\t\n')).to.throw(expectedErrorMsg);
  });
});