var mysql = require('mysql');

module.exports = {

	/**
	 * [exports description]
	 *
	 * @return {[type]}            [description]
	 */
	connect: function() {
		/* Create the SQL connection using the default parameters */
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'kme',
			password : 'kme',
			database : 'kuwaitandme'
		});

		/* Connect to the DB */
		connection.connect();

		/* Return the connection object */
		return connection;
	}
};