ClassifiedSearch = require("./classified.search");

module.exports = ClassifiedSearch.extend({
	render: function (argument) {
		$("#classified-search").addClass('show-statuses');
	}
});