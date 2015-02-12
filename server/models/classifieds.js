module.exports = {
	/**
	 * Returns the top classifieds. Usually the ones that should be displayed on
	 * the homepage.
	 *
	 * @param  db        The database connection object.
	 * @param  callback  The callback function to call once the query is
	 *                   finished.
	 */
	getTopClassifieds: function(db, callback) {
		/* SQL query to retrieve the top classifieds */
		var query = "SELECT * " +
			"FROM classified " +
			"WHERE status = 2 " +
			"ORDER BY id DESC " +
			"LIMIT 10";

		/* The callback function once the SQL query gets executed */
		var querySolver = function (error, rows, fields) {
			if (error) throw error;

			/* Call the callback function with the result */
			callback(rows);
		}

		/* Execute the query */
		db.query(query, querySolver);
	}
}