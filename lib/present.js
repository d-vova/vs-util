var present = module.exports = function present ( header, object, levels, prefix ) {
  var key = String(header || 'Object'), value = object;
  var levels = levels || 0, prefix = String(prefix || '');
  var width = present.width(value, levels);

  return [ prefix + '*', present.level(key, value, width, levels, prefix) ].join(' ');
}

present.width = function presentWidth ( object, levels ) {
  if ( !(object instanceof Object && levels > 0) ) return 0;

  var max = 0;

  for ( var key in object ) {
    max = Math.max(max, Math.max(key.length, present.width(object[key], levels - 1)));
  }

  return max;
}

present.level = function presentLevel ( key, value, width, levels, prefix ) {
  var shouldExpand = value instanceof Object && levels > 0;
  if ( !shouldExpand ) return present.value(key, value, width, prefix);

  var lines = [ String(key) ], keys = [ ];
  for ( var key in value ) keys.push(key);

  for ( var i = 0; i < keys.length; i += 1 ) {
    var key = keys[i], hasMoreKeys = i < keys.length - 1;
    var base = prefix + (hasMoreKeys ? '| ' : '  ');
    var level = present.level(key, value[key], width, levels - 1, base);

    lines.push([ prefix + (hasMoreKeys ? '|--' : '`--'), level ].join(' '));
  }

  return lines.join('\n');
}

present.value = function presentValue ( key, value, width ) {
  var key = String(key);
  var value = JSON.stringify(value);

  while ( key.length < width ) key += ' ';

  return key + ' => ' + value;
}


present.log = function presentLog ( header, object, levels, prefix ) {
  console.log(present(header, object, levels, prefix));
}


if ( require.main === module ) {
  console.log('Testing present at "' + __filename + '"...');

  var config = {
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

  present.log('config', config, 4, '// ');
}
