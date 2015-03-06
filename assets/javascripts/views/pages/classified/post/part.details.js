var xss = require('xss');

module.exports = Backbone.View.extend({
	events: {
		"change #cat-selector" : "catSelected",
		"change #locations" : "unlockMapAndAddress",
		"change #price-selector" : "priceSelected",
	},

	initialize: function(options) {
		this.model = options.model;
		this.$address1 = this.$el.find("#address1");
		this.$address2 = this.$el.find("#address2");
		this.$email = this.$el.find("#email");
		this.$locations = this.$el.find("#locations");
		this.$parCategory = this.$el.find("#cat-selector");
		this.$phone = this.$el.find("#phone");
		this.$priceField = this.$el.find('#price-field');
		this.$priceSelector = this.$el.find("#price-selector");
		this.$subCategory = this.$el.find("#subcat-selector");
		this.$type = this.$el.find("#ctype");

		this.categories = app.models.categories.toJSON();
		this.locations = app.models.locations.toJSON();

		/* Initialize parts of the form */
		this.initCategories();
		this.initLocations();
	},


	/**
	 * [render description]
	 */
	render: function() { },


	validate: function (e) {
		var ret = true;

		var $els = this.$el.find("[required]");
		$els.removeClass('error');
		$els.each(function(i) {
			var $el = $els.eq(i);
			if(!$el.val()) {
				$el.addClass('error');
				ret = false;
			}
		});

		if(!ret) {
			this.model.trigger('post:error', "Some of the fields are missing");
			return false;
		}

		this.setModel();
		return true;
	},


	/**
	 * Handler function to change the price boxes
	 */
	priceSelected: function(event) {
		var val =  this.$priceSelector.find(":selected").val();
		switch(val) {
			case "Free":
				this.$priceField.val(0);
				this.$priceField.addClass('hide');
				break;
			case "Custom":
				this.$priceField.val(null);
				this.$priceField.removeClass('hide');
				break;
			case "Contact Owner":
				this.$priceField.val(-1);
				this.$priceField.addClass('hide');
				break;
		}
	},


	/**
	 * Generates the HTML code for a select option.
	 */
	generateOption: function(id, name, disabled) {
		if(disabled)
			return "<option data-id='-1' value='-1' disabled>" + name +
				"</option>";
		return "<option data-id='" + id + "' value='" + id + "'>" + name +
			"</option>";
	},


	/**
	 * Handler function to change the subcategory select box based on the parent
	 * select option.
	 */
	catSelected: function(e) {
		var id = this.$parCategory.find(":selected").data("id");

		this.$subCategory.show();
		this.$subCategory.removeAttr("disabled");

		for(var i=0; i<this.categories.length; i++)
			if(this.categories[i]._id == id) {
				var children = this.categories[i].children;

				this.$subCategory.html(
					this.generateOption(0, "Choose a sub-category", true)
				);
				for(var j=0; j<children.length; j++) {
					var html = this.generateOption(children[j]._id,
						children[j].name);
					this.$subCategory.append(html);
				}

				return;
			}
	},


	/**
	 * Initializes the categories option.
	 */
	initCategories: function() {
		this.$subCategory.hide();
		this.$parCategory.val(0);

		for(var i=0; i<this.categories.length; i++) {
			var html = this.generateOption(this.categories[i]._id,
				this.categories[i].name);
			this.$parCategory.append(html);
		}
	},


	/**
	 * Initializes the locations.
	 */
	initLocations: function () {
		for(var i=0; i<this.locations.length; i++) {
			var html = this.generateOption(this.locations[i]._id,
				this.locations[i].name);
			this.$locations.append(html);
		}
	},


	/**
	 * Gets all the form data from the page, into a local variable and returns
	 * it.
	 */
	setModel: function() {
		this.model.set({
			category: this.$subCategory.val(),
			price: this.$priceField.val(),
			type: this.$type.val(),

			contact: {
				address1: xss(this.$address1.val()),
				address2: xss(this.$address2.val()),
				email: xss(this.$email.val()),
				location: this.$locations.val(),
				phone: xss(this.$phone.val())
			}
		});
	},
});