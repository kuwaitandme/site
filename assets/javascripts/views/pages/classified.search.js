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
					isFitWidth: true,
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

		/* Clear out the classified list */
		$classifiedList.html("");

		/* For each classified, apply the template and append it into the
		 * container */
		_.each(window.data.classifieds, function(post) {
			post.created = app.helpers.date.prettify(post.created);
			var html = listTemplate(post)
			$classifiedList.append(html);
		});
	}
});