module.exports = controller = Backbone.View.extend({
	ajaxEnable: true,
	ajaxLock: false,
	gridMinimumSize: 250,
	pageIndex: 0,

	collection: new app.models.classifieds,

	/* Initialize the view */
	initialize: function() {
		console.log("[view:classifieds-search] initializing")
		var that = this;

		/* Get the template */
		this.listTemplate = _.template(this.$el.find("#list-template").html());

		/* Attach a listener to our collection model */
		this.listenTo(this.collection, "ajax:done", this.addClassifieds);

		/* Do something with the GET parameters here.. */
		// var url = document.URL;
		// this.get = app.helpers.url.getGETstring(url);

		/* Setup of local dom variables */
		this.$classifiedList = this.$el.find("ul#classified-search");

		/* Render the page */
		this.render();

		/* Fire the AJAX event for the first time to load the first set of
		 * classifieds */
		this.fireAjaxEvent();

		/* Set to load new classifieds when we have scrolled to the end of the
		 * page. */
		$(window).scroll(function() {
			if(that.ajaxEnable) that.fireAjaxEvent();
		});
	},


	/* Render the elements in the view into the DOM */
	render: function () {
		console.log("[view:classifieds-search] rendering")
		var that = this;

		// $("#main-container").fadeIn();

		this.setupMasonry();
		// this.spinner = new app.views.components.spinner();

		this.resizeClassifieds();
		$(window).resize(function() { that.resizeClassifieds(); });
	},


	/**
	 * A nice little function that resizes all the classifieds into neat columns
	 * while maintaining a proper ratio and minimum size. See source for the
	 * algorithm used.
	 */
	resizeClassifieds: function () {
		/* Calculate the width of a single 1x1 sqaure. Subtract 5px from the
		 * window's width to compensate for the scroll bar */
		var windowWidth = $(window).width() - 50;
		var columns = Math.floor(windowWidth / this.gridMinimumSize);
		var excessSpace = windowWidth - (this.gridMinimumSize * columns);
		var finalSize = Math.floor(this.gridMinimumSize + (excessSpace / columns));

		/* Set each of the blocks with the right size */
		this.$el.find(".classified").width(finalSize);
	},


	/**
	 * [fireAjaxEvent description]
	 */
	fireAjaxEvent: function() {
		if(!this.ajaxEnable || this.ajaxLock) return;

		if($(window).scrollTop() >= ($(document).height() - $(window).height())
			* 0.9) this.ajaxLoadClassifieds();
	},



	/**
	 * This function performs the AJAX call to load more classified into the
	 * DOM while at the same time manipulating the spinner and the UI to let
	 * the user know that more classifieds are loading.
	 */
	ajaxLoadClassifieds: function() {
		this.ajaxLock = true;

		/* Show the spinner while loading */
		// this.spinner.show();

		/* Obtain the parameters to be sent to the back-end */
		this.pageIndex += 1;
		var url = app.helpers.url.insertParam("page", this.pageIndex);
		var parameters = app.helpers.url.getGETstring(url);

		/* Fetch the classifieds from the back-end */
		this.collection.fetch(parameters);
	},


	/*
	 * This function gets called whenever a new model has been added into our
	 * collection. This function is responsible for adding the classified
	 * into the DOM while properly taking care of aligning it too.
	 *
	 * @param  [Backbone.Model]  classifieds   An array containing the new
	 *                                         classifieds if any.
	 */
	addClassifieds: function(classifieds) {
		var that = this;

		/* All done. Hide the spinner and disable the lock */
		// this.spinner.hide();
		this.ajaxLock = false;

		/* Signal the ajax controller to stop polling the server */
		if(classifieds.length == 0) this.ajaxEnable = false;

		/* Add each classified into the DOM */
		_.each(classifieds, function(classified) {
			var html = that.listTemplate(classified.toJSON());
			var elem = $(html);

			/* Append element into DOM and reload Masonry */
			that.$classifiedList.append(elem);
			that.$classifiedList.masonry("appended", elem);
		});

		/* Reload Masonry once for all the elements */
		this.$classifiedList.masonry();

		/* Reload Masonry again for every-time a new image has been loaded */
		var reloadMasonry = function() { that.$classifiedList.masonry(); };
		// imagesLoaded(this.$classifiedList, reloadMasonry);

		/* Fire the AJAX event again! In case we haven't filled up the rest
		 * of the body yet.
		 */
		this.fireAjaxEvent();
	},



	/**
	 * Sets up the Masonry objects
	 */
	setupMasonry: function () {
		this.$classifiedList.masonry({
			// columnWidth: 290,
			// gutter: 0,
			// isFitWidth: true,
			isAnimated: true,
			itemSelector: '.classified',
		});
	}
});