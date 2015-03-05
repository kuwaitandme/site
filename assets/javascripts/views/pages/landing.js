module.exports = Backbone.View.extend({
	events: {
		"click .cl-title" : "toggleClassified"
	},

	initialize: function() {
		console.log("[init] view landing");
		this.$topClassifieds = $('#top-classifieds .content');
		this.$categoryList = $('#masonry-container .content');
	},

	render: function(){
		var that = this;
		var categories = window.categories;

		var categoriesTemplate = _.template(
			$("#list-template").html());
		that.$categoryList.html("");

		categories = app.helpers.category.appendCounters(
			categories,
			window.data.categoryCount
		);


		/* Render out each of the categories */
		for(var i=0; i<categories.length; i++) {
			var html = categoriesTemplate(categories[i]);
			that.$categoryList.append(html);
		}

		/* Add the post counts to the classifieds */
		that.addCounters();
		this.setupMasonry();
	},


	/**
	 * [toggleClassified description]
	 *
	 * @param  {[type]} e [description]
	 */
	toggleClassified: function (e) {
		var $el = $(e.currentTarget).parent();

		var $list = $el.find(".cl-list");
		if($list.height() == 0) this.openClassified($el, $list);
		else this.closeClassified();
	},


	/**
	 * [openClassified description]
	 *
	 * @param  {[type]} $el   [description]
	 * @param  {[type]} $list [description]
	 */
	openClassified: function($el, $list) {
		var that = this;
		this.closeClassified();

		$el.addClass('active');

		$list.css('height', 'auto')
		var height = $list.height();
		this.catMasonry.layout();
		$list.height(0);

		$list.stop().transition({ height: height }, function() {
			that.catMasonry.layout();
		});
	},


	/**
	 * [closeClassified description]
	 */
	closeClassified: function() {
		var that = this;
		var $el = $(".cl-container");
		$el.removeClass('active');

		var $list = $el.find('.cl-list');
		$list.stop().transition({ height: 0 }, function() {
			that.catMasonry.layout();
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

		this.catMasonry = new Masonry(this.$categoryList[0], {
			columnWidth: 10,
			isFitWidth: true,
			itemSelector: '.cl-item'
		});
	},
});