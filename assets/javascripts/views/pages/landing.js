module.exports = Backbone.View.extend({

	events: {
		"click .cl-container" : "openClassified"
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

		$list.stop().animate({ height: height });
	},


	closeClassified: function(e) {
		var that = this;
		var $el = $(".cl-container");
		$el.removeClass('active');

		var $list = $el.find('.cl-list');
		$list.animate({ height: 0 });
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
		this.$topClassifieds = $('#top-classifieds .content');
		this.$categoryList = $('#masonry-container .content');

		this.render();
		this.setupMasonry();
	},

	render: function(){
		var that = this;

		var categoriesTemplate = _.template(
			$("#list-template").html());
		that.$categoryList.html("");

		var categories = window.categories;

		categories = app.helpers.category.appendCounters(
			categories,
			window.data.categoryCount
		);

		for(var i=0; i<categories.length; i++) {
			/* Render out the category */
			var html = categoriesTemplate(categories[i]);
			that.$categoryList.append(html);
		}

		/* Add the post counts to the classifieds */
		that.addCounters();
	}
});