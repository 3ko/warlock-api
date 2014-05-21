'use strict';
var fs = require('fs'),
    util = require('util'),
    request = require('request'),
    //async = require('./helpers').async,
    EventEmitter = require('events').EventEmitter;


var Client = exports.Client = function (options) {
  this.clouds = {};
  this.datacenters = {};
  this.options = options;
  this._request = request;

  if (typeof this.options.get !== 'function') {
    this.options.get = function (key) {
      return this[key];
    };
  }
};

util.inherits(Client, EventEmitter);


Client.prototype.request = function (options, callback) {
  options = options || {};

  var password = this.options.get('password') || this.options.get('apiToken'),
      auth = new Buffer(this.options.get('username') + ':' + password).toString('base64'),
      proxy = this.options.get('proxy'),
      optHeaders,
      self = this,
      opts = {};

  opts = {
    method: options.method || 'GET',
    uri: (options.remoteUri || this.options.get('remoteUri')) + '/' + options.uri.join('/'),
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    timeout: options.timeout || this.options.get('timeout') || 8 * 60 * 1000,
    rejectUnauthorized: this.options.get('rejectUnauthorized')
  };

  if (options.body) {
    try { opts.body = JSON.stringify(options.body); }
    catch (e) { return callback(e); }
  } else if (opts.method !== 'GET' && options.body !== false) {
    opts.body = '{}';
  }

  if (options.headers) Object.keys(options.headers).forEach(function each(field) {
    opts.headers[field] = options.headers[field];
  });

  optHeaders = this.options.get('headers');
  if (optHeaders) {
    Object.keys(optHeaders).forEach(function each(field) {
      opts.headers[field] = optHeaders[field];
    });
  }

  if (proxy) opts.proxy = proxy;

  this.emit('debug::request', opts);

  //
  // When we don't pass a callback just return the request object
  //
  return !callback || typeof callback !== 'function'
    ? this._request(opts)
    : this._request(opts, function requesting(err, res, body) {
      if (err) return callback(err);

      var poweredBy = res.headers['x-powered-by'],
          result, statusCode, error;

      try {
        statusCode = res.statusCode;
        result = JSON.parse(body);
      } catch (e) {}

      self.emit('debug::response', { statusCode: statusCode, result: result });

      if (!self.options.get('ignorePoweredBy') && !poweredBy || !~poweredBy.indexOf('Pm2-Warlock')) {
        error = new Error('The Pm2-Warlock-Api requires you to connect the Pm2-Warlock\'s stack');
        error.statusCode = 403;
        error.result = '';
      } else if (failCodes[statusCode]) {
        error = new Error('Error (' + statusCode + '): ' + failCodes[statusCode]);
        error.statusCode = statusCode;
        error.result = result;
      }
      // Only add the response argument when people ask for it
      if (callback.length === 3) return callback(error, result, res);
      callback(error, result);
    });
};

Client.prototype.upload = function (options, callback) {
  options = options || {};

  var progress = new EventEmitter(),
      self = this;

  fs.stat(options.file, function fstat(err, stat) {
    if (err) return callback(err);

    var size = stat.size;

    // Set the correct headers
    if (!options.headers) options.headers = {};
    options.headers['Content-Length'] = size;
    options.headers['Content-Type'] = options.contentType || 'application/octet-stream';

    // And other default options to do a successful post
    if (!options.method) options.method = 'POST';
    options.body = false;

    // Defer all the error handling to the request method
    var req = self.request(options);
    if (!req) return;

    req.on('error', callback);
    req.on('response', function (res) {
      var statusCode = res.statusCode,
          error;

      //
      // TODO: clean this up. This is an extraneous case that offsets the main
      // use case of the api so we repeat some code here
      //
      if (failCodes[statusCode]) {
        error = new Error('Error (' + statusCode + '): ' + failCodes[statusCode]);

        error.statusCode = statusCode;
        error.result = '';

        res.on('data', function (d) {
          error.result += d;
        });

        res.on('end', function () {
          try { error.result = JSON.parse(error.result) }
          catch (ex) {}
          callback(error);
        });
        return;
      }

      callback(null, res);
    });

    // Notify that we have started the upload procedure and give it a reference
    // to the stat.
    progress.emit('start', stat);

    req.once('request', function requested(request) {
      request.once('socket', function data(socket) {
        var buffer = 0;

        var interval = setInterval(function polling() {
          var data = socket._bytesDispatched || (socket.socket && socket.socket._bytesDispatched);

          if (data) {
            progress.emit('data', data - buffer);
            buffer = data;
          }

          if (buffer >= size) {
            clearInterval(interval);
            progress.emit('end');
          }
        }, 100);
      });
    });

    fs.createReadStream(options.file).pipe(req);
  });

  return progress;
};

var failCodes = {
  400: 'Bad Request',
  401: 'Not Authorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Item not found',
  405: 'Method not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  503: 'Service Unavailable'
};