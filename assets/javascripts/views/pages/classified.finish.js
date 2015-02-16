module.exports = Backbone.View.extend({
	events: {
		"click .price" : "managePayment",
		"click .submit" : "makePurchase"
	},

	perkPrices: [
		{ price:5, toggled: false},
		{ price:15, toggled: false}
	],


	managePayment: function(e) {
		var $el = $(e.currentTarget);
		var type = $el.data().val;
		var price = 0;

		var perk = this.perkPrices[type];
		perk.toggled = !perk.toggled;

		$("[name='perk-" + type + "'").val(perk.toggled);

		$el.parent().toggleClass('active', perk.toggled)
		this.perkPrices[type]= perk;

		if(this.perkPrices[0].toggled) price += this.perkPrices[0].price;
		if(this.perkPrices[1].toggled) price += this.perkPrices[1].price;

		if(price == 0) this.$tabPayment.hide();
		else this.$tabPayment.show();

		this.$tabPayment.find('.total span').html(price);
	},


	/**
	 * [getCreditDetails description]
	 */
	getCreditDetails: function() {
		return {
			cc: $("#cc").val(),
			cvv: $("#cvv").val(),
			month: $("#cmdate").val(),
			year: $("#cydate").val()
		}
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
	makePurchase: function() {
		var that = this;

		/* Called when token creation fails. */
		var errorCallback = function(data) {
			if (data.errorCode === 200) {
				/* This error code indicates that the ajax call failed.
				 * Recommend to retry the token request. */
			} else {
				alert(data.errorMsg);
			}
		};

		/* Called when token creation was successful */
		var successCallback = function(data) {
			var token = data.response.token.token;
			that.sendTokenBackend(token);
		};

		/* Get the credit card details */
		var credit = this.getCreditDetails();
		if(!this.validateCreditDetails(credit)) {
			var args = {
				sellerId: _2checkout.sid,
				publishableKey: _2checkout.publicKey,

				ccNo: credit.cc,
				cvv: credit.cvv,
				expMonth: credit.month,
				expYear: credit.year,
			};

			/* Request for the token and then send it to the backend */
			TCO.requestToken(successCallback, errorCallback, args);
		} else {
			console.log("invalid credit details");
		}
	},


	/**
	 * [sendTokenBackend description]
	 */
	sendTokenBackend: function(token) {
		var data = {
			_id: "",
			perks: [this.perkPrices[0].toggled, this.perkPrices[1].toggled],
			token: token
		};

		/* Perform AJAX call */
	},



	initialize: function(obj) {
		/* Load the public key */
		TCO.loadPubKey("sandbox");
		this.$tabPayment = this.$el.find("#tab-payment");
	}
});