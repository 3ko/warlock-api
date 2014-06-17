'use strict';

var util = require('util'),
    Client = require('./client').Client;

var Snapshots = exports.Snapshots = function (options) {
  Client.call(this, options);
};

util.inherits(Snapshots, Client);


Snapshots.prototype.list = function (appName, callback) {

};

Snapshots.prototype.fetch = function (appName, version, callback) {

};

Snapshots.prototype.create = function (appName, version, filename, callback) {
  this.upload({ uri: ['apps', appName,'snapshots'], file: filename }, callback);
};

Snapshots.prototype.deploy = function (appName, version, callback) {

};

Snapshots.prototype.destroy = function (username, callback) {
  this.request({ method: 'DELETE', uri: ['users', user.username] }, callback);
};
