'use strict';


var util = require('util'),
    Client = require('./client').Client;

var Users = exports.Users = function (options) {
  Client.call(this, options);
};

util.inherits(Users, Client);

Users.prototype.auth = function (callback) {
  this.request({ uri: ['auth'] }, function (err, result) {
    if (err) return callback(err)
    callback(err, result);
  });
};

Users.prototype.create = function (user, callback) {
  this.request({ method: 'POST', uri: ['users', user.username], body: user }, callback);
};

Users.prototype.destroy = function (username, callback) {
  this.request({ method: 'DELETE', uri: ['users', user.username] }, callback);
};