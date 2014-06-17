'use strict';

var util = require('util'),
    Client = require('./client').Client;

var Keys = exports.Keys = function (options) {
  Client.call(this, options);
};

util.inherits(Keys, Client);
