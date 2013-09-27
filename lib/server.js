var EXECUTE = function EXECUTE ( request, response, callback ) { callback(); }


var LOG = 'VS UTIL SERVER:';

var METHOD = 'all';
var FORMATS = '(\.(html|json|txt))?';

var TEXT_REGEX = /^.*\.txt$/i;
var JSON_REGEX = /^.*\.json$/i;
var HTML_REGEX = /^.*\.html$/i;


var define = exports.define = function define ( server, routes ) {
  for ( var i = 0; i < routes.length; i += 1 ) {
    var route = routes[i];

    var method = route.method || 'all';
    var path = route.path ? route.path + '(\.(html|json|txt))?' : '*';
    var middleware = route.middleware || [ ];
    var execute = route.execute || EXECUTE;

    define.route(server, method, path, middleware, execute);
  }
}

define.route = function defineRoute(server, method, path, middleware, execute) {
  args = [ path ].concat(middleware);

  var action = function action ( request, response ) {
    var callback = function ( error, value ) {
      respond(request, response, error, value);
    }

    execute(request, response, callback);
  }

  args.push(action);

  server[method].apply(server, args);

  log(path, 'API was successfully added');
}


var respond = exports.respond = function respond ( request, response, error, value ) {
  if ( request.path.match(TEXT_REGEX) ) return respond.text(response, error, value);
  if ( request.path.match(JSON_REGEX) ) return respond.json(response, error, value);
  if ( request.path.match(HTML_REGEX) ) return respond.html(response, error, value);

  respond.html(response, error, value);
}

respond.html = function respondHTML ( response, error, value ) {
  var content = error && String(error) || value;

  if ( content instanceof Object ) {
    content = JSON.stringify(content, null, 2);
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(error ? '' : '<pre>' + content + '</pre>');
  response.end();
}

respond.text = function respondText ( response, error, value ) {
  var content = error && String(error) || value;

  if ( content instanceof Object ) {
    content = JSON.stringify(content, null, 2);
  }

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(content);
  response.end();
}

respond.json = function respondJSON ( response, error, value ) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(error ? null : value));
  response.end();
}


var log = exports.log = function log ( title, comment ) {
  if ( !log.isOn ) return null;

  var title = '\033[1m' + title + '\033[0m';

  console.log([ LOG, title, comment ].join(' '));
}


log.isOn = true;


if ( require.main === module ) {
  console.log('Testing server at "' + __filename + '"...');
}



//respond.begin = function respondBegin ( request, response ) {
//  if ( request.path.match(/^.*\.txt$/i) ) return respond.text.begin(response);
//  if ( request.path.match(/^.*\.json$/i) ) return respond.json.begin(response);
//  if ( request.path.match(/^.*\.html$/i) ) return respond.html.begin(response);
//
//  respond.html.begin(response);
//}
//
//respond.batch = function respondBatch ( request, response, value ) {
//  if ( request.path.match(/^.*\.txt$/i) ) return respond.text.batch(response, value);
//  if ( request.path.match(/^.*\.json$/i) ) return respond.json.batch(response, value);
//  if ( request.path.match(/^.*\.html$/i) ) return respond.html.batch(response, value);
//
//  respond.html.batch(response, value);
//}
//
//respond.end = function respondEnd ( request, response ) {
//  if ( request.path.match(/^.*\.txt$/i) ) return respond.text.end(response);
//  if ( request.path.match(/^.*\.json$/i) ) return respond.json.end(response);
//  if ( request.path.match(/^.*\.html$/i) ) return respond.html.end(response);
//
//  respond.html.end(response);
//}
//
//
//respond.html.begin = function respondHTMLBegin ( response ) {
//  response.writeHead(200, { 'Content-Type': 'text/html' });
//  response.write('<pre>');
//}
//
//respond.html.batch = function respondHTMLBatch ( response, value ) {
//  var content = value || '';
//
//  if ( content instanceof Object ) {
//    content = JSON.stringify(content, null, 2);
//  }
//
//  response.write(content);
//}
//
//respond.html.end = function respondHTMLEnd ( response ) {
//  response.write('</pre>');
//  response.end();
//}
//
//
//respond.text.begin = function respondTextBegin ( response ) {
//  response.writeHead(200, { 'Content-Type': 'text/plain' });
//}
//
//respond.text.batch = function respondTextBatch ( response, value ) {
//  var content = value || '';
//
//  if ( content instanceof Object ) {
//    content = JSON.stringify(content, null, 2);
//  }
//
//  response.write(content);
//}
//
//respond.text.end = function respondTextEnd ( response ) {
//  response.end();
//}
//
//
//respond.json.begin = function respondJSONBegin ( response ) {
//  response.writeHead(200, { 'Content-Type': 'application/json' });
//  response.write('[');
//}
//
//respond.json.batch = function respondJSONBatch ( response, value ) {
//  response.write(JSON.stringify(value || ''));
//}
//
//respond.json.end = function respondJSONEnd ( response ) {
//  response.write(']');
//  response.end();
//}
