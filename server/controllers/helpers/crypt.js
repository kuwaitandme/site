var bCrypt = require('bcrypt-nodejs');

/**
 * Generates a hash using bCrypt
 *
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
module.exports = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}