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
		this.setupSpinner();

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
		this.showSpinner();
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
					that.hideSpinner();
					that.ajaxLock = false;
				}, 500);
			}
		});
	},

	showClassifiedsEnd: function() {
		this.ajaxDisable = true;
	},

	setupSpinner: function() {
		var spinner = app.views.components.spinner;
		var opts = {
			className: 'spinner', // The CSS class to assign to the spinner
			color: '#000', // #rgb or #rrggbb or array of colors
			corners: 1, // Corner roundness (0..1)
			direction: 1, // 1: clockwise, -1: counterclockwise
			hwaccel: false, // Whether to use hardware acceleration
			left: '50%', // Left position relative to parent
			length: 5, // The length of each line
			lines: 12, // The number of lines to draw
			radius: 7, // The radius of the inner circle
			rotate: 36, // The rotation offset
			shadow: false, // Whether to render a shadow
			speed: 1.7, // Rounds per second
			top: '50%', // Top position relative to parent
			trail: 64, // Afterglow percentage
			width: 3, // The line thickness
			zIndex: 2e9, // The z-index (defaults to 2000000000)
		};
		this.spinner = new spinner(opts);
		this.$spinner = $("#ajax-spinner .spinner");
	},

	showSpinner: function() {
		this.spinner.spin();
		this.$spinner.hide();
		this.$spinner.html(this.spinner.el);
		this.$spinner.stop().fadeIn();
	},

	hideSpinner: function() {
		var that = this;
		this.$spinner.stop().fadeOut(function(){ that.spinner.stop(); });
	},

	/**
	 * Sets up the Masonry objects
	 */
	setupMasonry: function () {
		// this.masonry = this.$classifiedList.masonry;
		// console.log(this.$classifiedList.html());
		this.$classifiedList.masonry({
			columnWidth: 300,
			itemSelector: '.classified',

			// isFitWidth: true,
			isAnimated: true
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