vs-util
=======

Utilities commonly used in my projects


Installation
------------

```
npm install vs-util
```


Quick Start
-----------

```javascript
var util = require('vs-util');
```


HTTP
----

Working with http requests and data sent over the wire

```javascript
var util = require('vs-util');

var json = { a: 'b', c: { d: 'e', f: 'h' }, i: [ 'j', 'k', 'l' ] }

console.log(json);

// json { a: 'b', c: { d: 'e', f: 'h' }, i: [ 'j', 'k', 'l' ] }
```


#### Request ####

Send HTTP request

```javascript
var method = util.http.GET, type = util.http.FORM,
var host = 'www.google.com', port = 80, path = '/';
var data = json, callback = function callback ( error, value ) {
  console.log(error || value);
}

util.http.request(method, host, port, path, data, type, callback);
```


#### Encode ####

Convert JSON object into format used by HTTP Request

```javascript
var encoded = util.http.encode(json);

console.log(encoded);

// encoded { a: '"b"', c: '{"d":"e","f":"h"}', i: '["j","k","l"]' }
```


#### Decode ####

Convert encoded object back into JSON format

```javascript
var decoded = util.http.decode(encoded);

console.log(decoded);

// decoded { a: 'b', c: { d: 'e', f: 'h' }, i: [ 'j', 'k', 'l' ] }
```


#### Shortcuts ####

*GET*, *POST*, *PUT*, and *DELETE* have corresponding shortcuts
with their corresponding data types *FORM*, *JSON*, *HTML*, and *TEXT*

```javascript
util.http.get(host, port, path, data, callback);

util.http.post(host, port, path, data, callback);
util.http.post.form(host, port, path, data, callback);
util.http.post.json(host, port, path, data, callback);
util.http.post.html(host, port, path, data, callback);
util.http.post.text(host, port, path, data, callback);

util.http.put(host, port, path, data, callback);
util.http.put.form(host, port, path, data, callback);
util.http.put.json(host, port, path, data, callback);
util.http.put.html(host, port, path, data, callback);
util.http.put.text(host, port, path, data, callback);

util.http.del(host, port, path, data, callback);
util.http.del.form(host, port, path, data, callback);
util.http.del.json(host, port, path, data, callback);
util.http.del.html(host, port, path, data, callback);
util.http.del.text(host, port, path, data, callback);
```


Auth
----

Working with authentication and authorization

#### Create ####

Create salted hash for a given password that is already salted and ready to be saved
(this method uses *SHA256*, and 32 bytes of salt)

```javascript
var password = 'my secret password';
var salthash = util.auth.create(password);

console.log(password);
console.log(salthash);

// my secret password
// f26883bbc9c5667c06858279b5572fecaffe58a51cbf56dce5442d018fc948655cf91b67b6b11ef4d5ce5f63bed8a0de95a37d0d470a6b716a35ad91a1e93446
```


#### Verify ####

When time comes and verification is required, simply call verify

```javascript
var drowssap = 'drowsapp terces ym';

var correct = util.auth.verify(password, salthash);
var incorrect = util.auth.verify(drowssap, salthash);

console.log(correct);   // true
console.log(incorrect); // false
```


#### Encode ####

Sometimes it is important to ensure security of other saved data
(this method uses *AES256*)

```javascript
var text = 'this is secret data that should be encoded and decoded';

var encoded = util.auth.encode(text, password, salthash);

console.log(encoded);

// encoded dc0159af5121e192b06fd38b35200a61d78cf50cbc68922fa3cf4ea45d82598d3aaff9ec68cd37988942a4834e2e3467519be89f92a2acf98ddb48f50e65b554
```

#### Decode ####

When time comes and decoding is required, simply call decode

```javascript
var decoded = util.auth.decode(encoded, password, salthash);

console.log(decoded);

// this is secret data that should be encoded and decoded
```


Server
------

#### Define ####

Add routes to express server instance

```javascript
var action = function action ( request, response, callback ) {
  callback(null, "Taking Action!");
}

var ping = function ping ( request, response, callback ) {
  callback(null, new Date().getTime());
}


var routes = [
  { method: 'get', path: '/action', middleware: [ ], execute: action },
  { method: 'get', path: '/ping',   middleware: [ ], execute: ping   }
];


var express = require('express');
var server = exporess();

util.server.define(server, routes);

server.listen(8080);
```

#### Respond ####

Send response in an appropriate format

```javascript
var express = require('express');
var server = exporess();

server.get('/action', function ( request, response ) {
  var error = null, value = 'this is html';
  
  util.server.respond(request, response, error, value);
});

server.get('/action.html', function ( request, response ) {
  var error = null, value = 'this is html again';
  
  util.server.respond(request, response, error, value);
});

server.get('/action.json', function ( request, response ) {
  var error = null, value = 'this is json';
  
  util.server.respond(request, response, error, value);
});

server.get('/action.txt', function ( request, response ) {
  var error = null, value = 'this is plain text';
  
  util.server.respond(request, response, error, value);
});

server.listen(8080);
```


Present
-------

Format JSON structure into a tree-like string representation

```javascript
var json = {
  ENV: 'DEV',
  NAME: 'vs-util presentation test',
  PORT: 8080,
  STUN: { host: 'stun.l.google.com', port: 19302 },
  MONGO: 'mongodb://localhost/vs-util',
  DB: {
    logs: {
      dropSync: false, batchSize: 10000,
      create: { capped: true, size: 123456789, autoIndexId: true },
      indexes: [ [ { id: 1 } ], [ { timestamp: 1 } ] ]
    }
  },
  SERVICES_MONGO: 'mongodb://heroku:1234567890abcdef1234567890abcdef@dharma.mongohq.com:10074/app12346789',
  SERVICES_DB: {
    services: { dropSync: false, batchSize: 10000 },
    snapshots: { dropSync: false, batchSize: 10000 }
  },
  SERVICES_REFRESH: 500,
  SERVICES_TIMEOUT: 500,
  SERVICES_DISCOVER: 60000,
  SERVICES_HEARTBEAT: 100,
  SERVICES_SNAPSHOT: 1000,
  LOG: { debug: -1, normal: 0, warning: 2, error: 3 }
}


var title = 'CONFIG', depth = 4, prefix = '// ';
var formatted = util.present(title, json, depth, prefix);

console.log(formatted);
```

For console output there is a shortcut

```javascript
util.present.log(title, json, depth, prefix);
```

The output in both cases is going to look like:

```
// * config
// |-- ENV                => "DEV"
// |-- NAME               => "vs-util presentation test"
// |-- PORT               => 8080
// |-- STUN
// | |-- host               => "stun.l.google.com"
// | `-- port               => 19302
// |-- MONGO              => "mongodb://localhost/vs-util"
// |-- DB
// | `-- logs
// |   |-- dropSync           => false
// |   |-- batchSize          => 10000
// |   |-- create
// |   | |-- capped             => true
// |   | |-- size               => 123456789
// |   | `-- autoIndexId        => true
// |   `-- indexes
// |     |-- 0                  => [{"id":1}]
// |     `-- 1                  => [{"timestamp":1}]
// |-- SERVICES_MONGO     => "mongodb://heroku:1234567890abcdef1234567890abcdef@dharma.mongohq.com:10074/app12346789"
// |-- SERVICES_DB
// | |-- services
// | | |-- dropSync           => false
// | | `-- batchSize          => 10000
// | `-- snapshots
// |   |-- dropSync           => false
// |   `-- batchSize          => 10000
// |-- SERVICES_REFRESH   => 500
// |-- SERVICES_TIMEOUT   => 500
// |-- SERVICES_DISCOVER  => 60000
// |-- SERVICES_HEARTBEAT => 100
// |-- SERVICES_SNAPSHOT  => 1000
// `-- LOG
//   |-- debug              => -1
//   |-- normal             => 0
//   |-- warning            => 2
//   `-- error              => 3
```


Generate
--------

Random buffer of given length

```javascript
var buffer = util.generate(8);

console.log(buffer);

// buffer <Buffer 41 6b 9e 2a 79 30 ba 67>
```


#### Hex ####

Generate random bytes of given length in hex

```javascript
var hex = util.generate.hex(8);

console.log(hex);

// hex 5f7dafd337bb870b
```

#### ID ####

Generate random unique id (16 bytes long)

```javascript
var id = util.generate.id();

console.log(id);

// id 42741578f9f17000bd7dc0bcc7a360ae
```


Logging
-------

The output to the console, generated by the module, can be turned on or off

```javascript
var mongo = require('vs-util');

mongo.log.on();    // turn logging on
mongo.log.off();   // turn logging off

mongo.log(true);   // turn logging on
mongo.log(false);  // turn logging off
```


License
-------

MIT
