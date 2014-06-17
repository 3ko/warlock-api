var crypto = require('crypto');

var Tools = exports.Tools = function (options) {}

Tools.pbkdf2 = function(password,salt,options,callback){

    if(typeof callback == "undefined" && typeof options == "function")
    {
      callback = options;
      options = {};
    }

    var keysize = 256 || options.keysize;
    var saltsize = keysize/8 || options.saltsize;
    var iterations = 4096 || options.iterations;

		crypto.pbkdf2( password, salt.substring(0,saltsize), iterations, keysize, function( err, derivedKey ) {
			var base64;
			if ( !err ) {
				base64 = binaryToBase64( derivedKey );
			}
			callback( err, base64, salt );
		});
}


Tools.sign = function(key,data,options,callback)
{
  if(typeof callback == "undefined" && typeof options == "function")
  {
    callback = options;
    options = {};
  }

  var algo = 'sha256' || options.algo;
  var hash_encoding = 'base64' || options.hash_encoding;

  try{
    var hash = crypto.createHmac(algo,key);
    hash.setEncoding(hash_encoding);
    hash.write(data);
    hash.end();
    if(callback == "undefined")
      return hash.read();
    callback(null,hash.read());
  }catch(e){
    if(callback == "undefined")
      return e;
    callback(e,null);
  }
}



function binaryToBase64( binary ){
  return new Buffer( binary, "binary" ).toString("base64");
}
function base64toBinary( base64 ){
  return new Buffer( base64, "base64" ).toString("binary");
}
