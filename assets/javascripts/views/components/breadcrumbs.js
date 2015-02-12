var helpers = require("../helpers/exports");


/**
 * Initialize the breadcrumbs links in the header.
 */
module.exports = {
	add: function(href, text) {
		var $dom = $("#breadcrumbs");
		var html = "<li><a href='" + href + "'>" + text + "</a></li>";
		$dom.append(html);
	}
}