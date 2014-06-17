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

};

Apps.prototype.create = function (app, callback) {
  var appName = this.defaultUser(app.name);
  this.request({ method: 'POST', uri: ['apps'], body: app }, callback);
};

Apps.prototype.available = function (appName, callback) {
  this.request({ uri: ['apps', 'available'], body: app }, callback);
};

Apps.prototype.get = function (appName, callback) {

};

Apps.prototype.update = function (appName, callback) {

};

Apps.prototype.destroy = function (appName, callback) {

};


//todo:

Apps.prototype.start = function (appName, callback) {
};

Apps.prototype.stop = function (appName, callback) {
};

Apps.prototype.restart = function (appName, callback) {
};
