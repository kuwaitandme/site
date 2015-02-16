module.exports = Backbone.View.extend({
	events: {
		"click .price" : "managePayment",
	},

	perkPrices: [
		{ price:5, toggled: false},
		{ price:15, toggled: false}
	],


	managePayment: function(e) {
		var $el = $(e.currentTarget);
		var type = $el.data().val;

		var perk = this.perkPrices[type];
		perk.toggled = !perk.toggled;

		$("[name='perk-" + type + "'").val(perk.toggled);

		$el.parent().toggleClass('active', perk.toggled)
		this.perkPrices[type]= perk;

		this.managePriceBox();
	},


	managePriceBox: function() {
		var price = 0;

		if(this.perkPrices[0].toggled) price += this.perkPrices[0].price;
		if(this.perkPrices[1].toggled) price += this.perkPrices[1].price;

		if(price == 0) this.$tabPayment.hide();
		else this.$tabPayment.show();

		this.$tabPayment.find('.total span').html(price);
	},



	initBraintree: function() {
		braintree.setup(data.braintreeToken, "dropin", {
			container: $('#payment-container')
		});
	},


	initialize: function(obj) {
		this.$tabPayment = this.$el.find("#tab-payment");
		this.initBraintree();
	}
});