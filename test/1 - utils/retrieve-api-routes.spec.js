'use strict';

const chai = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const values = require('object.values');

const { retrieveOfficialDocs, retrievePostmanDocs } = require('../../utils/retrieve-api-routes');

describe('utils/retrieve-api-routes.js', function () {
  describe('retrieving API endpoints', function () {
    it('should successfully retrieve the official API docs', function() {
      const promisedOfficialDocs = retrieveOfficialDocs();
      return Promise.all([
        expect(promisedOfficialDocs).to.eventually.be.fulfilled,
        expect(promisedOfficialDocs).to.eventually.be.an('object')
      ]);
    });

    it('should successfully retrieve the postman API docs', function() {
      this.timeout(0);
      const promisedPostmanDocs = retrievePostmanDocs();
      return Promise.all([
        expect(promisedPostmanDocs).to.eventually.be.fulfilled,
        expect(promisedPostmanDocs).to.eventually.be.an('object')
      ]);
    });
  });

  describe('testing structure of retrieved resources', function () {
    const OFFICIAL_DOC_PARAMS = [ 'source', 'group', 'path', 'method', 'description', 'alt_path', 'params' ];
    const POSTMAN_DOC_PARAMS = [ 'source', 'group', 'path', 'method', 'description' ];

    before('retrieving API endpoint resources', function () {
      const flatten = arr => [].concat(...arr);
      const getAllEndpoints = docs => flatten(values(docs));
      this.pOfficialEndpoints = retrieveOfficialDocs().then(getAllEndpoints);
      this.pPostmanEndpoints = retrievePostmanDocs().then(getAllEndpoints);
    });

    context('official documentation', function () {
      it(`should have the following fields: [${OFFICIAL_DOC_PARAMS.join(', ')}]`, function () {
        return Promise.all([
          expect(this.pOfficialEndpoints).to.eventually.be.an('array'),
          expect(this.pOfficialEndpoints).to.eventually.all.have.keys(OFFICIAL_DOC_PARAMS)
        ]);
      });
    });

    context('postman documentation', function () {
      it(`should have the following fields: [${POSTMAN_DOC_PARAMS.join(', ')}]`, function () {
        this.timeout(0);
        return Promise.all([
          expect(this.pPostmanEndpoints).to.eventually.be.an('array'),
          expect(this.pPostmanEndpoints).to.eventually.all.have.keys(POSTMAN_DOC_PARAMS)
        ]);
      });
    });
  });
});