'use strict';

var parts = ['Apps', 'Users', 'Client', 'Snapshots'];


exports['tools'] = require('./tools').Tools;

parts.forEach(function forEach(k) {
  exports[k] = require('./client/' + k.toLowerCase())[k];
});

exports.createClient = function createClient(options) {
  var client = {};

  parts.forEach(function generate(k) {
    var endpoint = k.toLowerCase();

    client[endpoint] = new exports[k](options);

    if (options.debug) {
      client[endpoint].on('debug::request', debug);
      client[endpoint].on('debug::response', debug);
    }
  });

  function debug(args) {
    console.log(args);
  }

  return client;
};
