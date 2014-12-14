'use strict';

var _ = require('lodash');
var knox = require('knox');

exports.client = function (domain, opts){
  return {

    url: function (key){
      return 'https://s3-' + opts.region + '.amazonaws.com/' + domain + key;
    },


    get: function (path, callback) {

      /**
       * Make a connection to the bucket:
       */

      var client = knox.createClient({
          key: opts.keyid
        , secret: opts.secret
        , bucket: domain
        , region: opts.region
        }
      );

      client.get(path).on('response', function (res){
        var body, str = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          str += chunk;
        });

        res.on('end', function () {
          if (200 === res.statusCode) {
            if (res.headers['content-type'].substring(0, 5) === 'text/'){
              body = str;
            } else {
              body = JSON.parse(str);
            }
            callback(null, body);
          } else {
            callback('Document not found', res.req.url);
          }
        });
      }).end();
    },

    put: function (path, object, contentType, callback) {

      var req, string;

      if (_.isFunction(contentType)){
        callback = contentType;
        contentType = null;
      }

      /**
       * Make a connection to the bucket:
       */

      var client = knox.createClient({
          key: opts.keyid
        , secret: opts.secret
        , bucket: domain
        , region: opts.region
        }
      );

      /**
       * Work out what we're sending: strings get pushed
       * unmodified, whilst JSON objects get turned into
       * strings and the Content-Type header set:
       */

      if (_.isString(object)){
        string = object;
        contentType = contentType || 'text/plain';
      } else {
        string = JSON.stringify(object);
        contentType = 'application/json';
      }

      /**
       * Create a request object:
       *
       * NOTE: Don't try to use client.putBuffer() since it doesn't calculate the
       * string length correctly with UTF8.
       */

      req = client.put(path, {
          'Content-Length': Buffer.byteLength(string)
        , 'Content-Type': contentType + '; charset=utf-8'
        }
      );

      req.on('response', function (res){
        if (200 === res.statusCode) {
          callback(null, object);
        } else {
          callback('Unable to put document to ' + req.url + ' [' + res.statusCode +
            ']');
        }
      });
      req.end(string);
    },

    del: function (path, callback) {

      /**
       * Make a connection to the bucket:
       */

      var client = knox.createClient({
          key: opts.keyid
        , secret: opts.secret
        , bucket: domain
        , region: opts.region
        }
      );
      client.del(path).on('response', function (res){
        callback(null, path, res.statusCode);
      }).end();
    }


  };
};