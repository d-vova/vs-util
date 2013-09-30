var LOG = 'VS UTIL SERVER:';

var METHOD = 'all', HTML_TYPE = 'html', JSON_TYPE = 'json', TEXT_TYPE = 'txt';

var ANY_ROUTE = ':0([^]+?)?';
var EXTENSION = ':ext(?:\.(' + [ HTML_TYPE, JSON_TYPE, TEXT_TYPE ].join('|') + '))?';


var route = exports.route = function route ( server, api, content ) {
  if ( api instanceof Array ) {
    for ( var i = 0; i < api.length; i += 1 ) route(server, api[i], content);
  }
  else {
    var base = content || { }
    var method = api.method || METHOD;
    var path = (api.path || '*').replace('*', ANY_ROUTE) + EXTENSION;

    var config = function config ( request, response, next ) {
      request.context = { }

      for ( var key in base ) {
        request.context[key] = base[key];
      }

      request.context.query = request.query || { };
      request.context.body = request.body || { };
      request.context.param = request.params || { };

      return next();
    }

    var handle = function handle ( request, response ) {
      callback = function callback ( error, value ) {
        respond(request, response, error, value);
      }

      execute(api, request.context, callback);
    }

    server[method](path, config, handle);

    var space = method.length == 3 ? '  ' : ' ';
    var title = method.toUpperCase() + space + path;

    log(title, '');
  }
}


var channel = exports.channel = function channel ( socket, api, content ) {
  if ( api instanceof Array ) {
    for ( var i = 0; i < api.length; i += 1 ) channel(socket, api[i], content);
  }
  else {
    var base = content || { }
    var incoming = api.incoming;
    var outgoing = api.outgoing;

    var callback = function callback ( error, value ) {
      var result = { error: error, value: value }

      socket.emit(outgoing, result);
    }

    var handle = function handle ( args ) {
      var context = { }, args = args || { }

      for ( var key in base ) context[key] = base[key];
      
      context.query = args.query || { }
      context.body = args.body || { }
      context.param = args.param || { }

      execute(api, context, callback);
    }

    socket.on(incoming, handle);
  }
}


var execute = exports.execute = function execute ( api, context, callback ) {
  var middleware = api.middleware || [ ];

  var pos = 0, next = function next ( error ) {
    if ( error ) return callback(error);

    if ( pos < middleware.length ) {
      pos += 1; middleware[pos - 1](context, next);
    }
    else api(context, callback);
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
