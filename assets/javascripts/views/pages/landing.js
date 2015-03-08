module.exports = Backbone.View.extend({
	events: {
		"click .cl-title" : "toggleClassified",
		"click .search-button" : "submitSearch"
	},

	initialize: function(objs) {
		console.log("[view:landing] initializing");
		if(objs.$el) this.$el = objs.$el;

		app.loadResource("masonry");

		this.$topClassifieds = this.$el.find('#top-classifieds .content');
		this.$categoryList = this.$el.find('#masonry-container .content');
		this.$categoryList.hide();
	},

	render: function(){
		console.log("[view:landing] rendering");
		var that = this;

		this.categories = app.models.categories.toJSON();

		this.categoriesTemplate = _.template(
			this.$el.find("#list-template").html());
		that.$categoryList.html("");

		/* Render out each of the categories */
		for(var i=0; i<this.categories.length; i++) {
			var html = this.categoriesTemplate(this.categories[i]);
			this.$categoryList.append(html);
		}
	},


	postAnimation: function() {
		this.$categoryList.fadeIn();
		this.setupMasonry();
	},


	/**
	 * [submitSearch description]
	 *
	 * @param  {[type]} events [description]
	 */
	submitSearch: function(event) {
		event.preventDefault();
		var $el = this.$el.find("[name='keywords']");
		var text = $el.val();
		text.replace(" ", "+");
		console.log(text);

		app.goto("/classified/search/?keywords=" + text, "classified-search", null);
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
		that.$categoryList.masonry();
		$list.height(0);

		$list.stop().transition({ height: height }, function() {
			that.$categoryList.masonry();
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
			that.$categoryList.masonry();
		});
	},


	/**
	 * Initializes Masonry to arrange the top classifieds and bottom categories
	 */
	setupMasonry: function() {
		var that = this;

		this.$categoryList.masonry({
			columnWidth: 10,
			isAnimated: true,
			isFitWidth: true,
			itemSelector: '.cl-item'
		});
	},
});