# resourceful-s3

An S3 back-end for Resourceful.

[![wercker status](https://app.wercker.com/status/b4e47c2d83bda3d53c657629a79b9bd6/m/master "wercker status")](https://app.wercker.com/project/bykey/b4e47c2d83bda3d53c657629a79b9bd6)

## Testing

To run the tests you'll need to add your AWS keys. This can be done by copying `config/environment.yaml` to `config/test.yaml` and adding your keys, before running `npm test`. The tests make use of a bucket called `resourceful-s3.test` which needs to exist.

## Using the module

As with other Resourceful modules, use the `use()` method to connect resources to a backend -- in this case an S3 bucket. For example:

```javascript
var Creature = resourceful.define('creature', function () {
  this.string('diet');
  this.bool('vertebrate');
  this.array('belly');

  this.timestamps();

  this.prototype.feed = function (food) {
    this.belly.push(food);
  };

  this.use('S3', {
    uri: 'myCreatures'
  , opts: {
      keyid: AWS_CONFIG.accessKeyId
    , secret: AWS_CONFIG.secretAccessKey
    , region: AWS_CONFIG.region
    }
  });
});
```

This will result in JSON files being managed as objects in the bucket `myCreatures`. The path for the files representing the objects will be the resource type (in this case `creature`), followed by the ID. For example:

```javascript
var wolf = new Creature();

wolf.id = 'brian';
wolf.save(function (err, creature){
  ...
});
```

will result in a JSON file stored in S3 at the URL:

```
http://myCreatures.s3.amazonaws.com/creature/brian
```

See the tests for more examples of how to use the library. More substantial help is available at the [Resourceful](https://npmjs.org/package/resourceful) site.

Note that although get, put, update and delete functionality is working fine, there is no way to do a find.

Any bucket used by the module will need to already exist.
