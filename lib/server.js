var LOG = 'VS UTIL SERVER:';

var METHOD = 'all', HTML_TYPE = 'html', JSON_TYPE = 'json', TEXT_TYPE = 'txt';

var ANY_ROUTE = ':0([^]+?)?';
var EXTENSION = ':ext(?:\.(' + [ HTML_TYPE, JSON_TYPE, TEXT_TYPE ].join('|') + '))?';


var define = exports.define = function define ( server, route ) {
  if ( route instanceof Array ) {
    for ( var i = 0; i < route.length; i += 1 ) define(server, route[i]);
  }
  else {
    var method = route.method || METHOD;
    var path = (route.path || '*').replace('*', ANY_ROUTE) + EXTENSION;

    var handle = function handle ( request, response ) {
      callback = function callback ( error, value ) {
        respond(request, response, error, value);
      }

      execute(route, request.context, callback);
    }

    server[method](path, handle);

    var space = method.length == 3 ? '  ' : ' ';
    var title = method.toUpperCase() + space + path;

    log(title, '');
  }
}


var execute = exports.execute = function execute ( route, context, callback ) {
  var middleware = route.middleware || [ ];

  var pos = 0, next = function next ( error ) {
    if ( error ) return callback(error);

    if ( pos < middleware.length ) {
      middleware[pos](context, next); pos += 1;
    }
    else route(context, callback);
  }

  next();
}


var respond = exports.respond = function respond ( request, response, error, value ) {
  switch ( request.params.ext ) {
    case HTML_TYPE: return respond.html(response, error, value);
    case JSON_TYPE: return respond.json(response, error, value);
    case TEXT_TYPE: return respond.text(response, error, value);
    default: return respond.html(response, error, value);
  }
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
  response.write(String(content));
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
