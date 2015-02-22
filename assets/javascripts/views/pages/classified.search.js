module.exports = Backbone.View.extend({
	initialize: function() {
		var that = this;
		this.listTemplate = _.template($("#list-template").html());
		this.pageIndex = 1;
		this.ajaxLock = false;
		this.ajaxDisable = false;

		// Do something with the GET parameters here..
		// var url = document.URL;
		// this.get = app.helpers.url.getGETstring(url);

		this.render();
		this.setupMasonry();
		this.addClassifieds(window.data.classifieds);
		this.spinner = new app.views.components.spinner();

		$(window).scroll(function() {
			if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.9) {
				that.ajaxLoadClassifieds();
			}
		});
	},

	ajaxLoadClassifieds: function() {
		if(this.ajaxLock || this.ajaxDisable) return;
		var that = this;

		this.ajaxLock = true;
		this.spinner.show();
		this.pageIndex += 1;

		$.ajax({
			url: document.URL + "&page=" + this.pageIndex,
			type: 'post',
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
				}, 500);
			}
		});
	},

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


	addClassifieds: function(classifieds) {
		var that = this;
		var elems;


		var fragement = document.createDocumentFragment();

		/* For each classified, apply the template and append it into the
		 * container */
		_.each(classifieds, function(post) {
			post.price = that.formatPrice(post.price);
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
	},

	render: function () {
		this.$classifiedList = $("ul#classified-search");
		// this.$classifiedList.html("");
	},

	formatPrice: function(price) {
		if(price == 0) return "Free"
		if(price == -1) return "Contact Owner";
		if(price) return price.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD";
	}
});