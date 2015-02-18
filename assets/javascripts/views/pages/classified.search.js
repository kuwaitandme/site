module.exports = Backbone.View.extend({
	initialize: function() {
		var url = document.URL;
		this.get = app.helpers.url.getGETstring(url);

		// Do something with the GET parameters here..

		this.render();
		this.setupMasonry();

		/* Reload every time window is resized */
		$(window).resize(this.setupMasonry);
	},

	/**
	 * Sets up the Masonry objects
	 */
	setupMasonry: function () {
		var that = this;

		/* Add masonry to the objects */
		var $container = $('ul.classified-list');
		var prefWidth =
			$container.ready(function() {
				that.masonry = new Masonry($container[0], {
					itemSelector: 'li.classified'
				}
			);
		});

		/* Reload, every time an image has been loaded */
		var reloadMasonry = function() {
			if(that.masonry) that.masonry.layout()
		};
		imagesLoaded($(".classified-list img"), reloadMasonry);
	},


	render: function () {
		var listTemplate = _.template($("#list-template").html());
		var $classifiedList =  $("ul.classified-list");
		var that = this;

		/* Clear out the classified list */
		$classifiedList.html("");

		/* For each classified, apply the template and append it into the
		 * container */
		_.each(window.data.classifieds, function(post) {
			post.price = that.formatPrice(post.price);
			post.created = app.helpers.date.prettify(post.created);
			post.perks = null || post.perks;

			var html = listTemplate(post)
			$classifiedList.append(html);
		});
	},

	formatPrice: function(price) {
		if(price == 0) return "Free"
		if(price == -1) return "Contact Owner";
		if(price) return price.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD";
	}
});