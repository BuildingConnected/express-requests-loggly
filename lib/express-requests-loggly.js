/*!
 * express-requests-loggly
 * https://github.com/BuildingConnected/express-requests-loggly
 */

'use strict';

var defaults = require('defaults');
var setObjectPath = require('object-path-set');
var getObjectPath = require('get-object-path');

/**
 * @module express-requests-loggly
 */

module.exports = LogglyRequestLogger;

/**
 * Create a new request logger.
 *
 * @example
 *
 * ```javascript
 * var logger = new LogglyRequestLogger({
 *   client: loggly.createClient({
 *     token: 'KEY',
 *     subdomain: 'SUBDOMAIN',
 *     json: true
 *   })
 * });
 * ```
 *
 * @param {Object} settings
 * @param {loggly.Client} settings.client
 * @returns {LogglyRequestLogger}
 * @alias module:express-requests-loggly
 * @class
 */
function LogglyRequestLogger(settings) {
  if (!(this instanceof LogglyRequestLogger)) {
    return new LogglyRequestLogger(settings);
  }

  this.settings = defaults(settings, {
    whitelist: [
      'req.httpVersion',
      'req.headers',
      'req.method',
      'req.originalUrl',
      'req.path',
      'req.query',
      'res.statusCode',
      'res.took',
      'req.error'
    ],
    censor: [
      'req.body.password'
    ]
  });

  if (!this.settings.client) {
    throw new Error('no loggly client specified using settings.client');
  }
}

/**
 * Capture and log express requests.
 *
 * @example
 *
 * ```javascript
 * app.use(logger.requestHandler());
 * ```
 *
 * @returns {Function} returns express middleware
 */
LogglyRequestLogger.prototype.requestHandler = function () {
  var logger = this;

  return function LogglyRequestLoggerRequestHandler(req, res, next) {
    var client = logger.settings.client;
    var env = process.env.NODE_ENV || 'development';
    var whitelist = logger.settings.whitelist;
    var censor = logger.settings.censor;
    var end = res.end;
    var start = Date.now();
    var entry = {
      timestamp: (new Date()).toISOString()
    };
    var meta = {
      req: req,
      res: res
    };

    res.end = function () {
      res.end = end;

      end.apply(res, arguments);

      res.took = Date.now() - start;

      whitelist.forEach(function (path) {
        setObjectPath(entry, path, getObjectPath(meta, path));
      });

      censor.forEach(function (path) {
        var val = getObjectPath(meta, path);

        if (typeof val !== 'undefined') {
          setObjectPath(entry, path, '**censored**');
        }
      });

      client.log(entry, [env], function (err) {
        if (err) {
          console.error(err);
        }
      });
    };

    next();
  };
};

/**
 * Add errors to `req.error` before logging.
 *
 * @example
 *
 * ```javascript
 * app
 *   .use(logger.requestHandler())
 *   .use(app.router)
 *   .use(logger.errorHandler())
 *   .use(express.errorHandler());
 * ```
 *
 * @returns {Function} reutrns express error handler middleware
 */
LogglyRequestLogger.prototype.errorHandler = function () {
  return function LogglyRequestLoggerErrorHandler(err, req, res, next) {
    req.error = err;
    next(err);
  };
};
