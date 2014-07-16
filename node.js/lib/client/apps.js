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


Apps.prototype.list = function (callback) {
  this.request({ uri: ['apps'] }, callback);
};

Apps.prototype.create = function (app, callback) {
  this.request({ method: 'POST', uri: ['apps'], body: app }, callback);
};

Apps.prototype.available = function (app, callback) {
  this.request({ method: 'POST', uri: ['apps','available'], body: app }, callback);
};

Apps.prototype.get = function (appName, callback) {
  this.request({ uri: ['apps',appName] }, callback);
};

Apps.prototype.update = function (app, callback) {
  this.request({ method: 'PUT', uri: ['apps',app.name], body: app }, callback);
};

Apps.prototype.destroy = function (appName, callback) {
  this.request({ method: 'DELETE', uri: ['apps',appName] }, callback);
};


//todo:

Apps.prototype.start = function (appName, callback) {
  this.request({ method: 'POST', uri: ['apps',app.name,'start'] }, callback);
};

Apps.prototype.stop = function (appName, callback) {
  this.request({ method: 'POST', uri: ['apps',app.name,'stop'] }, callback);
};

Apps.prototype.restart = function (appName, callback) {
  this.request({ method: 'POST', uri: ['apps',app.name,'restart'] }, callback);
};
