var util = require('util'),
    Client = require('./client').Client;

//
// ### function Apps (options)
// #### @options {Object} Options for this instance
// Constructor function for the Apps resource responsible
// with Nodejitsu's Apps API
//
var Apps = exports.Apps = function (options) {
  Client.call(this, options);
};

// Inherit from Client base object
util.inherits(Apps, Client);

Apps.prototype.create = function (app, callback) {
  var appName = this.defaultUser(app.name);
  this.request({ method: 'POST', uri: ['apps', appName], body: app }, callback);
};