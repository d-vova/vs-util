var generate = module.exports = function generate ( length ) {
  var id = '';

  for ( var i = 0; i < length; i += 1 ) {
    id += 10 * Math.random() | 0;
  }

  return id;
}


generate.id = function generateID ( ) {
  return new Date().getTime() + generate(6);
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
}
