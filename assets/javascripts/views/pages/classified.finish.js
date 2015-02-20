module.exports = Backbone.View.extend({
	events: {
		"click .enabled .active" : "managePayment",
		"click .enabled .cancel" : "managePayment",
		"click .submit" : "makePurchase"
	},

	perkPrices: [
		{ price:5, toggled: false},
		{ price:15, toggled: false}
	],

	initialize: function(obj) {
		/* Save the window data */
		this.data = window.data;
		this.$tabPayment = this.$el.find("#tab-payment");

		this.post = window.data.classified;
		this.post.created = app.helpers.date.prettify(this.post.created);

		this.render();
		this.generateSocialLinks();

		this.setupSpinner();
		this.showSpinner();
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

	managePayment: function(e) {
		var $el = $(e.currentTarget);
		var type = $el.data().val;
		var price = 0;

		$el.parent().toggleClass('switch');

		var perk = this.perkPrices[type];
		perk.toggled = !perk.toggled;

		$("[name='perk-" + type + "'").val(perk.toggled);

		$el.parent().toggleClass('active', perk.toggled)
		this.perkPrices[type]= perk;

		if(this.perkPrices[0].toggled) {
			price += this.perkPrices[0].price;
		}
		if(this.perkPrices[1].toggled) price += this.perkPrices[1].price;

		$("#classified-sample li").toggleClass('perk-urgent', this.perkPrices[0].toggled);

		if(price == 0) this.$tabPayment.hide();
		else this.$tabPayment.show();

		this.$tabPayment.find('.total span').html(price);
	},


	/**
	 * [generateSocialLinks description]
	 */
	generateSocialLinks: function() {
		var url = "https://" + window.location.hostname + "/classified/single/"
			+ this.post._id;

		var tweet = "Check out my classified at " + url;

		var facebook = "https://www.facebook.com/sharer/sharer.php?u=" + url;
		var twitter = "https://twitter.com/home?status=" + encodeURI(tweet);
		var gplus = "https://plus.google.com/share?url=" + url;

		$(".social .facebook").attr('href', facebook);
		$(".social .twitter").attr('href', twitter);
		$(".social .gplus").attr('href', gplus);
	},


	/**
	 * [getCreditDetails description]
	 */
	getCreditDetails: function() {
		return {
			cc: "40000000c00000002",
			cvv: "522",
			month: "02",
			year: "12"
		};
		return {
			cc: $("#cc").val(),
			cvv: $("#cvv").val(),
			month: $("#cmdate").val(),
			year: $("#cydate").val()
		};
	},


	/**
	 * [validateCreditDetails description]
	 */
	validateCreditDetails: function(credit) {
		return true;
	},


	/**
	 * [makePurchase description]
	 */
	makePurchase: function(e) {
		e.preventDefault();
		_2checkout = this.data._2checkout;
		var that = this;

		/* Called when token creation fails. */
		var errorCallback = function(response) {
			if (response.errorCode === 200) {
				/* This error code indicates that the ajax call failed.
				 * Recommend to retry the token request. */
			} else {
				console.log(response.errorMsg);
			}
		};

		/* Called when token creation was successful */
		var successCallback = function(data) {
			console.log(data);
			var token = data.response.token.token;
			that.sendTokenBackend(token);
		};

		/* Get the credit card details */
		var credit = this.getCreditDetails();
		if(this.validateCreditDetails(credit)) {
			var args = {
				sellerId: _2checkout.sid,
				publishableKey: _2checkout.publicKey,

				ccNo: credit.cc,
				cvv: credit.cvv,
				expMonth: credit.month,
				expYear: credit.year,
			};

			console.log(args);
			/* Load the public key */
			TCO.loadPubKey("sandbox", function() {
				/* Request for the token and then send it to the backend */
				TCO.requestToken(successCallback, errorCallback, args);
			});
		} else {
			console.log("invalid credit details");
		}
	},


	/**
	 * [sendTokenBackend description]
	 */
	sendTokenBackend: function(token) {
		var data = {
			_id: this.post._id,
			perks: [this.perkPrices[0].toggled, this.perkPrices[1].toggled],
			token: token,

			billingAddr: {
				name: "Testing Tester",
				addrLine1: "123 Test St",
				city: "Columbus",
				state: "Ohio",
				zipCode: "43123",
				country: "USA",
				email: "example@2co.com",
				phoneNumber: "5555555555"
			}
		};

		/* Perform AJAX call */
		$.ajax({
			type: "POST",
			url: document.URL,
			data: data,
			dataType: 'json',
			success: function(response) {
				if(response.status == "success") console.log("all cool");
				else console.log("Payment could not be processed");
			},
		});
	},


	render: function() {
		var template = _.template($("#list-template").html());

		var html = template(this.post);
		$("#classified-sample").html(html);
	}
});