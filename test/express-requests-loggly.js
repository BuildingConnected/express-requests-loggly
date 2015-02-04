/*!
 * express-requests-loggly
 * https://github.com/BuildingConnected/express-requests-loggly
 */

'use strict';

var expect = require('chai').expect;
var lib = process.env.JSCOV ? require('../lib-cov/express-requests-loggly') : require('../lib/express-requests-loggly');

describe('express-requests-loggly module', function () {
  it('exports constructor', function () {
    expect(lib).to.be.an('function');
    expect(lib).to.have.property('name', 'LogglyRequestLogger');
  });
});
