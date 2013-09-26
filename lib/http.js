var url = require('url');
var http = require('http');
var querystring = require('querystring');


var CT_HTML = /^.*text\/html.*$/;
var CT_TEXT = /^.*text\/plain.*$/;
var CT_JSON = /^.*application\/json.*$/;


var request = module.exports = function request ( method, host, port, path, data, callback ) {
  if ( !host || !method ) return callback(new Error('cannot send request to unknown host'));

  var content = querystring.stringify(data);
  var headers = { 'Accept': '*/*', 'User-Agent': 'vs-util', 'Host': host }
  var options = { host: host, port: port || 80, path: path || '', method: method, headers: headers }

  switch ( method ) {
    case 'GET': { options.query = content; content = ''; } break;
    default: {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers['Content-Length'] = content.length;
    }
  }

  var connected = function connected ( response ) {
    var data = '';

    response.on('data', function ( chunk ) {
      data += chunk;
    });

    response.on('end', function ( ) {
      var type = response.headers['content-type'];

      if ( (type || '').match(CT_JSON) ) data = JSON.stringify(data);

      if ( callback ) callback(null, data);
    });
  }

  var httpRequest = http.request(options, connected);

  httpRequest.on('error', function ( error ) {
    if ( callback ) callback(error);
  });

  if ( content ) httpRequest.write(content);

  httpRequest.end();
}


var encode = exports.encode = function encode ( data ) {
  var content = { }

  for ( var key in data ) {
    content[key] = JSON.stringify(data[key]);
  }

  return content;
}

var decode = exports.decode = function decode ( data ) {
  var content = { }

  for ( var key in data ) {
    content[key] = data[key] instanceof Object ? data[key] : JSON.parse(data[key]);
  }

  return content;
}


var get = exports.get = function get ( host, port, path, data, callback ) {
  request('GET', host, port, path, data, callback);
}

var post = exports.post = function post ( host, port, path, data, callback ) {
  request('POST', host, port, path, data, callback);
}

var put = exports.put = function put ( host, port, path, data, callback ) {
  request('PUT', host, port, path, data, callback);
}

var del = exports.del = function del ( host, port, path, data, callback ) {
  request('DELETE', host, port, path, data, callback);
}


if ( require.main === module ) {
  console.log('Testing request at "' + __filename + '"...');

  var json = { a: 'b', c: { d: 'e', f: 'h' }, i: [ 'j', 'k', 'l' ] }

  var encoded = encode(json);
  var decoded = decode(encoded);

  console.log('json', json);
  console.log('encoded', encoded);
  console.log('decoded', decoded);

  var method = 'GET', host = 'www.google.com', port = 80, path = '/';
  var data = json, callback = function callback ( error, value ) {
    console.log(error || value);
  }
  
  request(method, host, port, path, data, callback);
}
