var url = require('url');
var http = require('http');
var querystring = require('querystring');


var GET = exports.GET = 'GET';
var POST = exports.POST = 'POST';
var PUT = exports.PUT = 'PUT';
var DELETE = exports.DELETE = 'DELETE';

var FORM_TYPE = exports.FORM = 'form';
var JSON_TYPE = exports.JSON = 'json';
var HTML_TYPE = exports.HTML = 'html';
var TEXT_TYPE = exports.TEXT = 'text';

var FORM_TYPE_VALUE = 'application/x-www-form-urlencoded';
var JSON_TYPE_VALUE = 'application/json';
var HTML_TYPE_VALUE = 'text/html';
var TEXT_TYPE_VALUE = 'text/plain';

var FORM_TYPE_REGEX = new RegExp('^.*' + FORM_TYPE_VALUE + '.*$');
var JSON_TYPE_REGEX = new RegExp('^.*' + JSON_TYPE_VALUE + '.*$');
var HTML_TYPE_REGEX = new RegExp('^.*' + HTML_TYPE_VALUE + '.*$');
var TEXT_TYPE_REGEX = new RegExp('^.*' + TEXT_TYPE_VALUE + '.*$');


var request = exports.request = function request ( method, host, port, path, data, type, callback ) {
  if ( !host || !method ) return callback(new Error('cannot send request to unknown host'));

  var content = { data: null, type: null }
  var headers = { 'Accept': '*/*', 'User-Agent': 'vs-util', 'Host': host }
  var options = { host: host, port: port || 80, path: path || '', method: method, headers: headers }

  switch ( type ) {
    case FORM_TYPE: {
      content.data = querystring.stringify(data);
      content.type = FORM_TYPE_VALUE;
    } break;
    case JSON_TYPE: {
      content.data = JSON.stringify(data);
      content.type = JSON_TYPE_VALUE;
    } break;
    case HTML_TYPE: {
      content.data = String(data);
      content.type = FORM_TYPE_VALUE;
    } break;
    case TEXT_TYPE: {
      content.data = String(data);
      content.type = FORM_TYPE_VALUE;
    } break;
    default: {
      content = querystring.stringify(data);
      content.type = FROM_TYPE_VALUE;
    }
  }

  if ( method != GET ) {
    headers['Content-Type'] = content.type;
    headers['Content-Length'] = content.data.length;
  }
  else options.path += '?' + querystring.stringify(data);

  var connected = function connected ( response ) {
    var data = '';

    response.on('data', function ( chunk ) {
      data += chunk;
    });

    response.on('end', function ( ) {
      var type = response.headers['content-type'];

      if ( (type || '').match(FORM_TYPE_REGEX) ) data = querystring.parse(data);
      if ( (type || '').match(JSON_TYPE_REGEX) ) data = JSON.parse(data);

      if ( callback ) callback(null, data);
    });
  }

  var httpRequest = http.request(options, connected);

  httpRequest.on('error', function ( error ) {
    if ( callback ) callback(error);
  });

  if ( method != GET ) httpRequest.write(content.data);

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
  request(GET, host, port, path, data, FORM_TYPE, callback);
}


var post = exports.post = function post ( host, port, path, data, callback ) {
  request(POST, host, port, path, data, FORM_TYPE, callback);
}

post.form = function postForm ( host, port, path, data, callback ) {
  request(POST, host, port, path, data, FORM_TYPE, callback);
}

post.json = function postJSON ( host, port, path, data, callback ) {
  request(POST, host, port, path, data, JSON_TYPE, callback);
}

post.html = function postHTML ( host, port, path, data, callback ) {
  request(POST, host, port, path, data, HTML_TYPE, callback);
}

post.text = function postText ( host, port, path, data, callback ) {
  request(POST, host, port, path, data, TEXT_TYPE, callback);
}


var put = exports.put = function put ( host, port, path, data, callback ) {
  request(PUT, host, port, path, data, FORM_TYPE, callback);
}

put.form = function putForm ( host, port, path, data, callback ) {
  request(PUT, host, port, path, data, FORM_TYPE, callback);
}

put.json = function putJSON ( host, port, path, data, callback ) {
  request(PUT, host, port, path, data, JSON_TYPE, callback);
}

put.html = function putHTML ( host, port, path, data, callback ) {
  request(PUT, host, port, path, data, HTML_TYPE, callback);
}

put.text = function putText ( host, port, path, data, callback ) {
  request(PUT, host, port, path, data, TEXT_TYPE, callback);
}


var del = exports.del = function del ( host, port, path, data, callback ) {
  request(DELETE, host, port, path, data, FORM_TYPE, callback);
}

del.form = function delForm ( host, port, path, data, callback ) {
  request(DELETE, host, port, path, data, FORM_TYPE, callback);
}

del.json = function delJSON ( host, port, path, data, callback ) {
  request(DELETE, host, port, path, data, JSON_TYPE, callback);
}

del.html = function delHTML ( host, port, path, data, callback ) {
  request(DELETE, host, port, path, data, HTML_TYPE, callback);
}

del.text = function delText ( host, port, path, data, callback ) {
  request(DELETE, host, port, path, data, TEXT_TYPE, callback);
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
  
  request(method, host, port, path, data, FORM_TYPE, callback);
}
