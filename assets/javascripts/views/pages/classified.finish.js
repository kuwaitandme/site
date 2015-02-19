module.exports = Backbone.View.extend({
	events: {
		"click .price.enabled" : "managePayment",
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
	 * [getCreditDetails description]
	 */
	getCreditDetails: function() {
		return {
			cc: "4000000000000002",
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
			_id: this.data.classified._id,
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



	initialize: function(obj) {
		/* Save the window data */
		this.data = window.data;
		this.$tabPayment = this.$el.find("#tab-payment");

		this.render();
	},

	render: function() {
		var template = _.template($("#list-template").html());

		var post = window.data.classified
		post.created = app.helpers.date.prettify(post.created);
		var html = template(post);

		$("#classified-sample").html(html);
	}
});