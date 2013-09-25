var crypto = require('crypto');

var create = exports.create = function create ( password, salthash, hashsalt ) {
  var pswd = new Buffer(password || '');
  var salt = new Buffer(extract(salthash), 'hex');

  var hash = crypto.createHash('sha256');

  if ( hashsalt ) {
    hash.update(Buffer.concat([ pswd, salt ]));
  }
  else {
    hash.update(Buffer.concat([ salt, pswd ]));
  }

  return Buffer.concat([ salt, hash.digest() ]).toString('hex');
}

var verify = exports.verify = function verify ( password, salthash ) {
  return create(password, salthash) == salthash;
}

var encode = exports.encode = function encode ( data, password, salthash ) {
  var hashsalt = create(password, salthash, true);
  var cipher = crypto.createCipher('aes256', hashsalt);

  var encrypted = cipher.update(data, 'utf8', 'hex');

  return encrypted += cipher.final('hex');
}

var decode = exports.decode = function decode ( data, password, salthash ) {
  var hashsalt = create(password, salthash, true);
  var decipher = crypto.createDecipher('aes256', hashsalt);

  var decrypted = decipher.update(data, 'hex', 'utf8');

  return decrypted + decipher.final('utf8');
}

var extract = exports.extract = function extract ( salthash ) {
  var salt = new Buffer(32);

  if ( !salthash || salthash.length < 2 * salt.length ) {
    for ( var i = 0; i < salt.length; i += 1 ) {
      salt.writeUInt8(256 * Math.random() | 0, i);
    }
  }
  else salt = new Buffer(salthash.substr(0, 2 * salt.length), 'hex');

  return salt.toString('hex');
}

if ( require.main === module ) {
  console.log('Testing auth at "' + __filename + '"...');

  var password = 'hello world';
  var drowssap = 'dlrow olleh';

  var salthash = create(password);
  var salthash2 = create(password, salthash);
  var hashsalt = create(password, salthash, true);

  var data = 'this is secret data that should be encoded and decoded';
  var encData = encode(data, password, salthash);
  var decData = decode(encData, password, salthash);

  console.log('password', password);
  console.log('salthash', salthash.length, salthash);
  console.log('salthash2', salthash2.length, salthash2);
  console.log('hashsalt', hashsalt.length, hashsalt);

  console.log('verify correct', verify(password, salthash));
  console.log('verify incorrect', verify(drowssap, salthash));

  console.log('data', data);
  console.log('encoded', encData);
  console.log('decoded', decData);
}
