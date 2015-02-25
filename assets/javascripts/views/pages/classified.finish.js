var controller = module.exports = Backbone.View.extend({
	events: {
		"click .enabled .active" : "managePayment",
		"click .enabled .cancel" : "managePayment",
		"click .submit" : "makePurchase"
	},

	messages: {
		perkpaid: 'Your perk is now activated',
	},

	perkPrices: [
		{ price:5, toggled: false},
		{ price:15, toggled: false}
	],

	initialize: function(obj) {
		/* Save the window data */
		this.data = window.data;
		this.$tabPayment = this.$el.find("#tab-payment");
		this.$paymentErrors = $("#payment-errors");
		this.$modal = $("#modal-purchase");


		this.post = window.data.classified;
		this.post.created = app.helpers.date.prettify(this.post.created);
		this.post.price = app.helpers.price.format(this.post.price);

		this.render();
		this.generateSocialLinks();


		this.spinner = new app.views.components.spinner();
		this.spinner.show();

		this.parseURL();
	},


	render: function() {
		var template = _.template($("#list-template").html());

		var html = template(this.post);
		$("#classified-sample").html(html);
	},


	/**
	 * [parseURL description]
	 */
	parseURL: function () {
		var msg = app.messages;
		var getParam = app.helpers.url.getParam;

		if(getParam('error')) msg.error(this.messages[getParam('error')]);
		if(getParam('success')) msg.success(this.messages[getParam('success')]);
		if(getParam('warn')) msg.warn(this.messages[getParam('warn')]);
	},


	/**
	 * [managePayment description]
	 *
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
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
	 *
	 * @return {[type]} [description]
	 */
	getCreditDetails: function() {
		return {
			ccNo: $("#ccc").val(),
			cvv: $("#cvv").val(),
			expMonth: $("#cmdate").val(),
			expYear: $("#cydate").val(),

			billingAddr: {
				city: $("#ccity").val(),
				addrLine1: $("#caddr1").val(),
				addrLine2: $("#caddr2").val(),
				country: $("#ccountry").val(),
				email: $("#cemail").val(),
				name: $("#cname").val(),
				phoneNumber: $("#cphone").val(),
				state: $("#cstate").val(),
				zipCode: $("#czip").val(),
			}
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
		var credit = this.getCreditDetails();

		/* Called when token creation fails. */
		var errorCallback = function(response) {
			console.error("Could not get a transaction token" + response.errorMsg);
			that.$modal.removeClass('switch');
			that.showPaymentError("Some fields are missing");

			if (response.errorCode === 200) {
				/* This error code indicates that the ajax call failed.
				 * Recommend to retry the token request. */
			}
		};

		/* Called when token creation was successful */
		var successCallback = function(data) {
			var token = data.response.token.token;
			credit.token = token;

			that.sendTokenBackend(credit);
		};

		/* Get the credit card details */
		if(this.validateCreditDetails(credit)) {
			credit.sellerId = _2checkout.sid;
			credit.publishableKey = _2checkout.publicKey;

			that.$modal.addClass('switch');

			/* Load the public key */
			TCO.loadPubKey("sandbox", function() {
				/* Request for the token and then send it to the backend */
				TCO.requestToken(successCallback, errorCallback, credit);
			});
		} else {
			console.log("invalid credit details");
		}
	},


	/**
	 * [showPaymentError description]
	 *
	 * @param  {[type]} message [description]
	 */
	showPaymentError: function(message) {
		this.$paymentErrors.show().html(message);
	},


	/**
	 * [sendTokenBackend description]
	 *
	 * @param  {[type]} credit [description]
	 * @return {[type]}        [description]
	 */
	sendTokenBackend: function(credit) {
		var data = {
			_csrf: window._csrf,
			_id: this.post._id,
			billingAddr: credit.billingAddr,
			perks: [this.perkPrices[0].toggled, this.perkPrices[1].toggled],
			token: credit.token
		};
		var that = this;

		that.$modal.addClass('switch');

		/* Perform AJAX call */
		$.ajax({
			type: "POST",
			url: document.URL,
			data: data,
			dataType: 'json',
			success: function(response) {
				if(response.status == "success") {
					window.location = "?success=perkpaid#";
				} else {
					console.error("Payment could not be processed", response, error);
					that.showPaymentError("Your credit details could not be authorized");
				}

				that.$modal.removeClass('switch');
			},
		});
	}
});