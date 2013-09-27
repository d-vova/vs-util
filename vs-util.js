var CALLBACK = exports.CALLBACK = function CALLBACK ( ) { }

var http = exports.http = require('./lib/http');
var auth = exports.auth = require('./lib/auth');
var server = exports.server = require('./lib/server');

var present = exports.present = require('./lib/present');
var generate = exports.generate = require('./lib/generate');


var log = exports.log = function log ( shouldLog ) {
  server.log.isOn = shouldLog;
}

log.on = function logOn ( ) {
  server.log.isOn = true;
}

log.off = function logOff ( ) {
  server.log.isOn = false;
}


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
