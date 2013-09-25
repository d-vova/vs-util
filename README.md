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
var method = 'GET', host = 'www.google.com', port = 80, path = '/';
var data = json, callback = function callback ( error, value ) {
  console.log(error || value);
}

util.request(method, host, port, path, data, callback);
```


#### Encode ####

Convert JSON object into format used by HTTP Request

```javascript
var encoded = util.encode(json);

console.log(encoded);

// encoded { a: '"b"', c: '{"d":"e","f":"h"}', i: '["j","k","l"]' }
```


#### Decode ####

Convert encoded object back into JSON format

```javascript
var decoded = util.decode(encoded);

console.log(decoded);

// decoded { a: 'b', c: { d: 'e', f: 'h' }, i: [ 'j', 'k', 'l' ] }
```


#### Shortcuts ####

*GET*, *POST*, *PUT*, and *DELETE* have corresponding shortcuts

```javascript
util.request.get(host, port, path, data, callback);
util.request.post(host, port, path, data, callback);
util.request.put(host, port, path, data, callback);
util.request.del(host, port, path, data, callback);
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


Present
-------


Generate
--------


