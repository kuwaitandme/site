module.exports = Backbone.View.extend({
	initialize: function() {
		var url = document.URL;
		this.get = app.helpers.url.getGETstring(url);

		// Do something with the GET parameters here..

		this.render();
	},

	/**
	 * Sets up the Masonry objects
	 */
	setupMasonry: function () {
		var that = this;

		/* Add masonry to the objects */
		var $container = $('.classified-list ul');
			$container.ready(function() {
				that.masonry = new Masonry($container[0], {
					columnWidth: 1,
					// isFitWidth: true,
					itemSelector: 'li'
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
		var $classifiedList =  $(".classified-list ul");

		/* Clear out the classified list */
		$classifiedList.html("");

		/* For each classified, apply the template and append it into the
		 * container */
		_.each(window.data.classifieds, function(post) {
			var html = listTemplate(post)
			$classifiedList.append(html);
		});

		this.setupMasonry();
	}
});