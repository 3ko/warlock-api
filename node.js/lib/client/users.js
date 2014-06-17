'use strict';


var util = require('util'),
    Client = require('./client').Client;

var Users = exports.Users = function (options) {
  Client.call(this, options);
};

util.inherits(Users, Client);

Users.prototype.auth = function (email,pkey,callback) {
  this.request({ uri: ['users','me'], user_email:email, user_pkey:pkey}, function (err, result) {
    if (err) return callback(err);
    callback(err, result);
  });
};

Users.prototype.create = function (user, callback) {
  this.request({ method: 'POST', uri: ['users'], body: user }, callback);
};

Users.prototype.destroy = function (username, callback) {
  this.request({ method: 'DELETE', uri: ['users', username] }, callback);
};

Users.prototype.update = function (user, callback) {
  this.request({ method: 'PUT', uri: ['users', user.username], body: user }, callback);
};
Users.prototype.promote = function (username, callback) {
  this.request({ method: 'PUT', uri: ['users', username,'type'] }, callback);
};
Users.prototype.demote = function (username, callback) {
  this.request({ method: 'PUT', uri: ['users', username,'type'] }, callback);
};

Users.prototype.stats = function (username, callback) {
  this.request({ uri: ['users', username,'stats'] }, callback);
};
