module.exports = controller = Backbone.View.extend({
	initialize: function() {
		var that = this;
		this.listTemplate = _.template($("#list-template").html());
		this.pageIndex = 1;
		this.ajaxLock = false;
		this.ajaxDisable = false;

		// Do something with the GET parameters here..
		// var url = document.URL;
		// this.get = app.helpers.url.getGETstring(url);
		this.$classifiedList = $("ul#classified-search");

		this.render();
		this.setupMasonry();
		this.addClassifieds(window.data.classifieds);
		this.spinner = new app.views.components.spinner();

		this.fireAjaxEvent();
		$(window).scroll(function() {
			that.fireAjaxEvent();
		});
	},


	render: function () {},


	/**
	 * [fireAjaxEvent description]
	 *
	 * @return {[type]} [description]
	 */
	fireAjaxEvent: function() {
		if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.9) {
			this.ajaxLoadClassifieds();
		}
	},


	/**
	 * [ajaxLoadClassifieds description]
	 *
	 * @return {[type]} [description]
	 */
	ajaxLoadClassifieds: function() {
		if(this.ajaxLock || this.ajaxDisable) return;
		var that = this;

		this.ajaxLock = true;
		this.spinner.show();
		this.pageIndex += 1;

		var url = app.helpers.url.insertParam("page", this.pageIndex);

		$.ajax({
			url: url,
			type: 'POST',
			data: { _csrf: window._csrf },
			dataType: 'json',
			success: function (data) {
				/* Add the classifieds and remove the lock after a delay of
				 * 500ms. This is because we want to avoid the AJAX request being
				 * fired again as masonry is still aligning the elements */
				if(data.classifieds && data.classifieds.length > 0) {
					that.addClassifieds(data.classifieds);
				} else {
					that.showClassifiedsEnd();
				}

				setTimeout(function() {
					that.spinner.hide();
					that.ajaxLock = false;

					/* Fire the AJAX event again! */
					that.fireAjaxEvent();
				}, 500);
			}
		});
	},


	/**
	 * [showClassifiedsEnd description]
	 * @return {[type]} [description]
	 */
	showClassifiedsEnd: function() {
		this.ajaxDisable = true;
	},


	/**
	 * Sets up the Masonry objects
	 */
	setupMasonry: function () {
		this.$classifiedList.masonry({
			columnWidth: 290,
			// gutter: 0,
			// isAnimated: true,
			itemSelector: '.classified',
		});
	},


	/**
	 * [addClassifieds description]
	 *
	 * @param {[type]} classifieds [description]
	 */
	addClassifieds: function(classifieds) {
		var that = this;
		var elems;


		var fragement = document.createDocumentFragment();

		/* For each classified, apply the template and append it into the
		 * container */
		_.each(classifieds, function(post) {
			post.price = app.helpers.price.format(post.price);
			post.created = app.helpers.date.prettify(post.created);

			if(!post.perks) post.perks = {};
			if(!post.title) post.title = '';

			var html = that.listTemplate(post);

			// var $el = $('<div class="classified w2">asd</div>');//$(html);
			var elem = $(html);
			 elems = elems ? elems.add( elem ) : elem;
		});

		that.$classifiedList.append(elems);
		that.$classifiedList.masonry("appended", elems);
		that.$classifiedList.masonry();

		/* Reload, every time an image has been loaded */
		var reloadMasonry = function() {
			that.$classifiedList.masonry();
		};
		imagesLoaded(this.$classifiedList, reloadMasonry);
	}
});