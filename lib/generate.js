var generate = module.exports = function generate ( length ) {
  var buffer = new Buffer(length);

  for ( var i = 0; i < length; i += 1 ) {
    buffer.writeUInt8(256 * Math.random() | 0, i);
  }

  return buffer;
}


generate.hex = function generateHex ( length ) {
  return generate(length).toString('hex');
}


generate.id = function generateID ( ) {
  var buffer = new Buffer(8);
  var timestamp = new Date().getTime();

  buffer.writeDoubleBE(timestamp, 0);

  return buffer.toString('hex') + generate.hex(8);
}

generate.ports = function generatePorts ( from, to ) {
  var list = [ ], result = [ ];

  for ( var n = from; n <= to; n += 1 ) list.push(n);

  while ( list.length > 0 ) {
    var index = list.length * Math.random() | 0;

    result.push(list[index]);

    list.splice(index, 1);
  }

  return result;
}


if ( require.main === module ) {
  console.log('Testing generate at "' + __filename + '"...');

  var buffer = generate(8);
  var hex = generate.hex(8);
  var id = generate.id();

  console.log('buffer', buffer);
  console.log('hex', hex);
  console.log('id', id);
}
