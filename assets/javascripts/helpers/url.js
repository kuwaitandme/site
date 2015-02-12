module.exports = {
	/**
	 * Serialize the object into a format recognized by HTTP "GET"
	 */
	serializeGET: function(obj) {
		var str = [];

		for(var p in obj) if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	},


	/**
	 * Get the path of the URL without any GET parameters
	 */
	getPlainPath: function() {
		var url = document.URL;

		/* Get rid of any GET parameters */
		if (url.indexOf("?") > -1) url = url.substr(0, url.indexOf("?"));
		if (url.indexOf("#") > -1) url = url.substr(0, url.indexOf("#"));
		return url;
	},


	/**
	 * Returns the get string of the given url.
	 */
	getGETstring: function(url) {
		if(!url) url = document.URL;
		if (url.indexOf("?") > -1) return url.substr(url.indexOf("?"), url.length);
		return "";
	},



	/**
	 * Returns the value of the given GET parameter in the current URL
	 *
	 * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-valu
	 * es-in-javascript
	 */
	getParam: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(
			results[1].replace(/\+/g, " "));
	},


	/**
	 * Re-construct the page's url with the new GET parameters (passed as an
	 * object array)
	 */
	reconstruct: function(get_data) {
		return this.getPlainPath() + "?" + this.serializeGET(get_data);
	},


	/**
	 * Returns a url with the language code embedded into it
	 */
	href: function(url) {
		return "/" + window.lang + "/" + url;
	}
}