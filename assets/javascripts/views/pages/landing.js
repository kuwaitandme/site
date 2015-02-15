module.exports = Backbone.View.extend({

	events: {
		"click .cl-container" : "openClassified",
		// "mouseleave .cl-container" : "closeClassified"
	},


	openClassified: function(e) {
		this.closeClassified();

		var that = this;
		var $el = $(e.currentTarget);
		var $list = $el.find('.cl-list');

		$el.addClass('active');

		$list.css('height', 'auto')
		var height = $list.height();
		this.bottomMasonry.layout();
		$list.height(0);

		$list.stop().animate({ height: height }, function() {
			// that.bottomMasonry.layout();
		});
	},


	closeClassified: function(e) {
		var that = this;
		var $el = $(".cl-container");
		$el.removeClass('active');

		var $list = $el.find('.cl-list');
		$list.animate({ height: 0 }, function() {
			// that.bottomMasonry.layout();
		});
	},


	/**
	 * Adds the post counters to each category.
	 */
	addCounters: function() {
		var counters = window.data.categoryCount;
		for(var i=0; i<counters.length; i++) {
			$("li[data-id='" + counters[i]._id + "'] .count").html(
				"(" + app.helpers.numbers.withCommas(counters[i].total) + ")"
			);
		}
	},


	/**
	 * Initializes Masonry to arrange the top classifieds and bottom categories
	 */
	setupMasonry: function() {
		var that = this;
		this.topMasonry = new Masonry(this.$topClassifieds[0], {
			columnWidth: 1,
			// isFitWidth true,
			itemSelector: '.top-c'
		});
		imagesLoaded(this.$topClassifieds, function() { that.topMasonry.layout(); });

		this.bottomMasonry = new Masonry(this.$categoryList[0], {
			columnWidth: 10,
			isFitWidth: true,
			itemSelector: '.cl-item'
		});
	},

	initialize: function() {
		this.$topClassifieds = $('#top-classifieds');
		this.$categoryList = $('#masonry-container');

		this.render.topClassifieds(this);
		this.render.categories(this);
		this.setupMasonry();
	},

	render: {
		/* Render the top classifieds */
		topClassifieds: function(that) {
			var topClassifiedsTemplate = _.template(
				$("#top-classifieds-template").html());
			that.$topClassifieds.html("");

			for(var i=0; i<data.topClassifieds.length; i++) {
				var classified = data.topClassifieds[i];
				classified.title = classified.title || "";

				/* Protect the 'thumb' variable */
				if(!classified.thumb) classified.thumb = null;

				/* Render out the top classifieds */
				var html = topClassifiedsTemplate(classified);
				that.$topClassifieds.append(html);
			}
		},

		/* Render the category lists */
		categories: function (that) {
			var categoriesTemplate = _.template(
				$("#list-template").html());
			that.$categoryList.html("");

			var categories = window.categories;

			for(var i=0; i<categories.length; i++) {
				/* Render out the category */
				var html = categoriesTemplate(categories[i]);
				that.$categoryList.append(html);
			}

			/* Add the post counts to the classifieds */
			that.addCounters();
		}
	}
});