exports.CALLBACK = function CALLBACK ( ) { }

exports.http = require('./lib/http');
exports.auth = require('./lib/auth');
exports.server = require('./lib/server');

exports.present = require('./lib/present');
exports.generate = require('./lib/generate');


if ( require.main === module && process.argv[2] == 'test' ) {
  var exec = require('child_process').exec;

  var log = function log ( error, value ) {
    console.log(error || value);
  }

  exec('node lib/http.js', log);
  exec('node lib/auth.js', log);
  exec('node lib/server.js', log);

  exec('node lib/present.js', log);
  exec('node lib/generate.js', log);
}
