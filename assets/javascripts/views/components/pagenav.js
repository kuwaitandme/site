module.exports = Backbone.View.extend({
	// template: Templates["pagenav"],

	properties: {
		display: true,
		curPage: 2,
		firstURL: "#",
		lastURL: "#",
		showFirst: true,
		showLast: true,
		pages: []
	},

	/**
	 * The logic for the page nav's different formats goes in here
	 */
	setProperties: function(currentPage, totalPages) {
		var p = this.properties;

		if(totalPages == 1) return (p.display = false);

		if(currentPage < 3) p.showFirst = false;
		if(currentPage > totalPages - 2) p.showLast = false;
		if(totalPages < 4) p.showFirst = p.showLast = false;

		var offset = -1;
		if(currentPage == 1) offset = 0;
		if(currentPage >= totalPages) offset = -2;

		p.firstURL = this.generateURL(1);
		p.lastURL = this.generateURL(totalPages);

		var limit = Math.min(totalPages, 3);
		var start = currentPage + offset;
		start = (start < 2 ? 1 : start);

		for(var i=start; i<start + limit; i++) {
			var className = (i == currentPage ? "current" : "");
			p.pages.push({
				"href":  this.generateURL(i),
				"class": className,
				"val": i
			});
		}
	},


	/**
	 * Helper function to generate the proper URL for the given page.
	 */
	generateURL: function(page) {
		/* Get the url, without any GET parameters */
		var cleanURL = app.helpers.url.getPlainPath();

		/* Split the url, so that we can read the last item */
		var parts = cleanURL.split("/");
		var part = parts.pop();

		/* If the last part is a number, then that is the page number, so in
		 * our final URL, don't add the last part. If it wasn't a number, then
		 * it was an actual term that is crucial for the page to render, add it
		 * back in... */
		if (isNaN(part)) parts.push(part);

		parts.push(page);
		/* Recombine all the parts to produce the final URL */
		return parts.join("/");
	},

	initialize: function(obj) {
		this.setProperties(obj.currentPage, obj.totalPages);
	},

	render: function() {
		this.$el.html(this.template(this.properties));
	}
});