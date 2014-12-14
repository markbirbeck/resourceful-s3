'use strict';

var base = require('resourceful-base-engine');
var util = require('util');

var S3 = function S3(config){
  config.protocol = 's3';
  config.supports = {
    patch: false
  };

  /**
   * Call the constructor of the base class:
   */

  S3.super_.call(this, config);

  /**
   * Now do our specific stuff:
   */

  this.connection = require('./s3').client(config.uri, config.opts);
};

/**
 * Base our class on the base engine:
 */

util.inherits(S3, base.BaseEngine);

/**
 * Now override the request method:
 */


S3.prototype.request = function(method, id, doc, callback) {
  if (!callback){
    callback = doc;
    doc = {};
  }

  if (method === 'del') {
    return this.connection.del(id, callback);
  }

  if (method === 'get') {
    return this.connection.get(id, callback);
  }

  if (method === 'put' || method === 'patch') {
    return this.connection.put(id, doc, callback);
  }

  console.log('request:', method, id, doc, callback);
  return callback(new Error(util.format('No %s handler', method)));
};



/**
 * Allow a reference to resourceful to be patched in:
 */

exports.attach = function init(resourcefulLib){
  base.register(resourcefulLib, 'S3', S3);
};
