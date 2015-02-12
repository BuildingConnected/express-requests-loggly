# express-requests-loggly [![Build Status](http://img.shields.io/travis/BuildingConnected/express-requests-loggly.svg?style=flat)](http://travis-ci.org/BuildingConnected/express-requests-loggly) [![NPM version](http://img.shields.io/npm/v/express-requests-loggly.svg?style=flat)](https://www.npmjs.org/package/express-requests-loggly) [![Dependency Status](http://img.shields.io/david/BuildingConnected/express-requests-loggly.svg?style=flat)](https://david-dm.org/BuildingConnected/express-requests-loggly)

> Log Express requests (including those with errors) to Loggly.

## Installation

Install using [npm](https://www.npmjs.org/):

```sh
npm install express-requests-loggly
```

## API Reference

<a name="exp_module_express-requests-loggly"></a>
##class: LogglyRequestLogger ⏏
**Members**

* [class: LogglyRequestLogger ⏏](#exp_module_express-requests-loggly)
  * [new LogglyRequestLogger(settings)](#exp_new_module_express-requests-loggly)
  * [express-requests-loggly.requestHandler()](#module_express-requests-loggly#requestHandler)
  * [express-requests-loggly.errorHandler()](#module_express-requests-loggly#errorHandler)

<a name="exp_new_module_express-requests-loggly"></a>
###new LogglyRequestLogger(settings)
Create a new request logger.

**Params**

- settings `Object`  
  - client `loggly.Client`  

**Returns**: `LogglyRequestLogger`  
**Example**  
```javascript
var logger = new LogglyRequestLogger({
  client: loggly.createClient({
    token: 'KEY',
    subdomain: 'SUBDOMAIN',
    json: true
  })
});
```

<a name="module_express-requests-loggly#requestHandler"></a>
###express-requests-loggly.requestHandler()
Capture and log express requests.

**Returns**: `function` - returns express middleware  
**Example**  
```javascript
app.use(logger.requestHandler());
```

<a name="module_express-requests-loggly#errorHandler"></a>
###express-requests-loggly.errorHandler()
Add errors to `req.error` before logging.

**Returns**: `function` - reutrns express error handler middleware  
**Example**  
```javascript
app
  .use(logger.requestHandler())
  .use(app.router)
  .use(logger.errorHandler())
  .use(express.errorHandler());
```

## Contributing

Please submit all issues and pull requests to the [BuildingConnected/express-requests-loggly](http://github.com/BuildingConnected/express-requests-loggly) repository!

## Tasks

List available tasks with `gulp help`.

## Tests

Run tests using `npm test` or `gulp test`.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/BuildingConnected/express-requests-loggly/issues).
