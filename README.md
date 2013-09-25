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

**GET**, **POST**, **PUT**, and **DELETE** have corresponding shortcuts

```javascript
util.request.get(host, port, path, data, callback);
util.request.post(host, port, path, data, callback);
util.request.put(host, port, path, data, callback);
util.request.del(host, port, path, data, callback);
```


Auth
----


Server
------


Present
-------


Generate
--------


