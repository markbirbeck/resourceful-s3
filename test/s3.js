'use strict';

var fs = require('fs')
  , path = require('path')
  , should = require('should');


/**
 * Fixtures:
 */

var fixture = [
  {
    'name': [
      'L.K.Bennett Cold Weather Platform Wedge Ankle Booties'
    , '-'
    , 'Cecily Shearling Lace Up'
    ].join(' ')
  , 'skuNumber': '759968'
  , 'manufacturerName': 'L.K.Bennett'
  , 'partNumber': 'CECILY SUEDE'
  }
  , 'A simple string of text'
  , {
    'category': 'unknown'
  , 'skuNumber': '1055467'
  , 'name': 'Jelly Pong Pong Mascara Lash Extension & Shadow Taffy SAVE £17.00'
  }
];


/**
 * Doc store tests
 */

describe('S3:', function (){

  var AWS_CONFIG = require('config').aws;

  var docStore = require('../lib/s3')
    .client(
      'resourceful-s3.test'
    , { keyid: AWS_CONFIG.accessKeyId, secret: AWS_CONFIG.secretAccessKey, region: AWS_CONFIG.region }
    );
  var baseKey = '/test/product/2012-01-02';

  describe('JSON documents:', function (){
    var key = baseKey + '.json';

    it('should put JSON doc by id', function (done){

      docStore.put(key, fixture[0], function (err, doc){
        should.not.exist(err);
        should.deepEqual(doc, fixture[0]);
        done();
      });
    });

    it('should get JSON doc by id', function (done){

      docStore.get(key, function (err, doc){
        should.not.exist(err);
        should.deepEqual(doc, fixture[0]);
        done();
      });
    });

    it('should delete JSON doc by id', function (done){

      docStore.del(key, function (err, id){
        should.not.exist(err);
        id.should.equal(key);
        done();
      });
    });
  });


  describe('JSON documents with UTF-8:', function (){
    var key = baseKey + '.json';

    it('should put UTF-8 JSON doc by id', function (done){

      docStore.put(key, fixture[2], function (err, doc){
        should.not.exist(err);
        should.deepEqual(doc, fixture[2]);
        done();
      });
    });

    it('should get UTF-8 JSON doc by id', function (done){

      docStore.get(key, function (err, doc){
        should.not.exist(err);
        should.deepEqual(doc, fixture[2]);
        done();
      });
    });

    it('should delete UTF-8 JSON doc by id', function (done){

      docStore.del(key, function (err, id){
        should.not.exist(err);
        id.should.equal(key);
        done();
      });
    });
  });


  describe('XML documents:', function (){
    var key = baseKey + '.xml';
    var xml = fs.readFileSync(
      path.join(__dirname, 'fixtures/product.xml')
    , { 'encoding': 'utf-8' }
    );

    it('should put XML doc by id', function (done){

      docStore.put(key, xml, 'text/xml', function (err, doc){
        should.not.exist(err);
        doc.should.equal(xml);
        done();
      });
    });

    it('should get XML doc by id', function (done){

      docStore.get(key, function (err, doc){
        should.not.exist(err);
        doc.should.equal(xml);
        done();
      });
    });

    it('should delete XML doc by id', function (done){

      docStore.del(key, function (err, id){
        should.not.exist(err);
        id.should.equal(key);
        done();
      });
    });
  });


  describe('Text documents:', function (){
    var key = baseKey + '.txt';

    it('should put text doc by id', function (done){

      docStore.put(key, fixture[1], function (err, doc){
        should.not.exist(err);
        doc.should.equal(fixture[1]);
        done();
      });
    });

    it('should get text doc by id', function (done){

      docStore.get(key, function (err, doc){
        should.not.exist(err);
        doc.should.equal(fixture[1]);
        done();
      });
    });

    it('should delete text doc by id', function (done){

      docStore.del(key, function (err, id){
        should.not.exist(err);
        id.should.equal(key);
        done();
      });
    });
  });
});
