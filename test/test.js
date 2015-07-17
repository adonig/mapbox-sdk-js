/* eslint no-shadow: 0 */
'use strict';

var test = require('tap').test,
  // fs = require('fs'),
  // path = require('path'),
  geojsonhint = require('geojsonhint'),
  MapboxClient = require('../');

// function storedFixture(t, value, name) {
//   var fixturePath = path.join(__dirname, 'fixtures', name);
//   if (process.env.UPDATE) {
//     fs.writeFileSync(fixturePath, JSON.stringify(value, null, 2));
//   }
//   t.deepEqual(value, JSON.parse(fs.readFileSync(fixturePath)), name);
// }

test('prerequisites', function(t) {
  t.ok(process.env.MapboxAccessToken, 'mapbox access token is provided');
  t.end();
});

test('MapboxClient', function(t) {
  t.throws(function() {
    var client = new MapboxClient();
    t.notOk(client);
  }, /accessToken required to instantiate MapboxClient/);
  var client = new MapboxClient('token');
  t.ok(client);
  t.equal(client.accessToken, 'token');
  t.end();
});

test('MapboxClient#geocodeForward', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeForward(null);
    }, /query/);
    t.throws(function() {
      client.geocodeForward(1, function() {});
    }, /query/);
    t.throws(function() {
      client.geocodeForward('foo', 1, function() {});
    }, /options/);
    t.throws(function() {
      client.geocodeForward('foo', 1);
    }, /callback/);
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Chester, New Jersey', function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward(
      'Chester, New Jersey', { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('options.proximity', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeForward('Paris', {
      proximity: { latitude: 33.6875431, longitude: -95.4431142 }
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.end();
});

test('MapboxClient#geocodeReverse', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.geocodeReverse(null);
    }, /location/);
    t.throws(function() {
      client.geocodeReverse(1, function() {});
    }, /location/);
    t.throws(function() {
      client.geocodeReverse('foo', 1, function() {});
    }, /options/);
    t.throws(function() {
      client.geocodeReverse('foo', 1);
    }, /callback/);
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse({ latitude: 33.6875431, longitude: -95.4431142 }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.test('dataset option', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.geocodeReverse(
      { latitude: 33.6875431, longitude: -95.4431142 },
      { dataset: 'mapbox.places' },
      function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results), [], 'results are valid');
      t.end();
    });
  });

  t.end();
});

test('MapboxClient#directions', function(t) {
  t.test('typecheck', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    t.throws(function() {
      client.getDirections(null);
    });
    t.throws(function() {
      client.getDirections(1, function() {});
    });
    t.throws(function() {
      client.getDirections('foo', 1, function() {});
    });
    t.throws(function() {
      client.getDirections('foo', 1);
    });
    t.end();
  });

  t.test('no options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results.origin), [], 'origin is valid');
      t.end();
    });
  });

  t.test('all options', function(t) {
    var client = new MapboxClient(process.env.MapboxAccessToken);
    t.ok(client);
    client.getDirections([
      { latitude: 33.6875431, longitude: -95.4431142 },
      { latitude: 33.6875431, longitude: -95.4831142 }
    ], {
      profile: 'mapbox.walking',
      instructions: 'html',
      alternatives: false,
      geometry: 'polyline'
    }, function(err, results) {
      t.ifError(err);
      t.deepEqual(geojsonhint.hint(results.origin), [], 'origin is valid');
      t.end();
    });
  });

  t.end();
});