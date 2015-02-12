module.exports = Backbone.View.extend({
	// template: Templates["filterbox"],


	events: {
		"change #cat-selector": "catSelected",
		"change #price-selector": "priceSelected",
		"click #filter-box-submit" : "submit",
		"click .keyword" : "keywordRemove",
		"click .option" : "toggleOption"
	},

	/**
	 * Shows the sub-option of the clicked option
	 */
	toggleOption: function(e) {
		$el = $(e.currentTarget).find(".sub-option");
		if($el.hasClass("active")) {
			$el.removeClass('active');
			$el.fadeOut();
		} else {
			$el.addClass('active');
			$el.fadeIn();
		}
	},


	/**
	 * Handler function to change the price boxes
	 */
	priceSelected: function(e) {
		var val =  $("#price-selector :selected").val();
		switch(val) {
			case "Free":
				this.setPriceRange(0, 0);
				this.hidePriceRange();
				break;
			case "Range":
				this.setPriceRange(null, null);
				this.showPriceRange();
				break;
			case "Exact":
				this.setPriceRange(1, 1);
				this.showPriceRangeExact();
				break;
			case "Contact Owner":
				this.setPriceRange(-1, -1);
				this.hidePriceRange();
				break;
		}
	},


	/**
	 * Hides the price range boxes
	 */
	hidePriceRange: function() {
		this.$el.find("input[name=\"maxprice\"]").addClass('hide');
		this.$el.find("input[name=\"minprice\"]").addClass('hide');
		this.$el.find("input[name=\"exactprice\"]").addClass('hide');
	},


	/**
	 * Shows the price range boxes
	 */
	showPriceRange: function() {
		this.hidePriceRange();
		this.$el.find("input[name=\"maxprice\"]").removeClass('hide');
		this.$el.find("input[name=\"minprice\"]").removeClass('hide');
	},


	/**
	 * Shows the exact price range box
	 */
	showPriceRangeExact: function() {
		this.hidePriceRange();
		this.$el.find("input[name=\"exactprice\"]").removeClass('hide');
	},


	/**
	 * Sets the price range boxes.
	 */
	setPriceRange: function(min, max) {
		this.$el.find("input[name=\"maxprice\"]").val(max);
		this.$el.find("input[name=\"minprice\"]").val(min);
		this.$el.find("input[name=\"exactprice\"]").val(max);

		if(min == 0 && max == 0) {
			$("#price-selector").val("Free");
			this.hidePriceRange();
		} else if(min == -1 && max == -1) {
			$("#price-selector").val("Contact Owner");
			this.hidePriceRange();
		} else if(max == min) {
			$("#price-selector").val("Exact");
			this.showPriceRangeExact();
		} else if(min || max) {
			$("#price-selector").val("Range");
			this.showPriceRange();
		}
	},


	/**
	 * Handler function to change the subcategory select box based on the parent
	 * select option.
	 */
	catSelected: function(e) {
		var id = $("#cat-selector :selected").data("id");

		var categories = window.data.categories;
		for(var i=0; i<categories.length; i++)
			if(categories[i].id == id) {
				var children = categories[i].children;

				$("#subcat-selector").html(
					this.generateOption("", "Choose a sub-category", true)
				);

				for(var j=0; j<children.length; j++) {
					var html = this.generateOption(children[j].id,
						children[j].name);
					$("#subcat-selector").append(html);
				}

				return;
			}
	},


	/**
	 * Given the id of a subcategory set both the parent and the child select
	 * category options.
	 */
	setSubCategory: function(id) {
		var categories = window.data.categories;

		for(var i=0; i<categories.length; i++) {
			var children = categories[i].children;
			for(var j=0; j<children.length; j++) {
				if(children[j] && children[j].id == id) {
					/* Set the parent category */
					$("#cat-selector").val(children[j].parent);

					/* Populate the child category */
					this.catSelected();

					/* Set the child category */
					$("#subcat-selector").val(children[j].id);
					return;
				}
			}
		}
	},


	/**
	 * Initializes the categories option.
	 */
	initCategories: function() {
		var categories = window.data.categories;

		for(var i=0; i<categories.length; i++) {
			var html = this.generateOption(categories[i].id, categories[i].name);
			$("#cat-selector").append(html);
		}
	},


	/**
	 * Generates the HTML code for a select option.
	 */
	generateOption: function(id, name, disabled) {
		if(disabled) return "<option data-id='" + id + "' value='" + id +
			"' disabled>" + name+ "</option>";
		return "<option data-id='" + id + "' value='" + id +
			"'>" + name+ "</option>";
	},


	/**
	 * Adds and animates a keyword bubble into the page
	 */
	keywordAdd: function(text) {
		if(!text.length) return;

		$container = $("#filter-box-keywords .keyword-container");
		var html = "<div class=\"keyword\">" + text + "</div>";

		/* Generate the DOM element, add it and animate it. */
		var $el = $(html).hide();
		$container.append($el);
		$el.fadeIn();
	},


	/**
	 * Fade and remove the keyword element
	 */
	keywordRemove: function(e) {
		console.log(e);
		var $el = $(e.currentTarget);
		$el.fadeOut(function() { $el.remove(); });
	},


	/**
	 * Handles keyboard input for the keyword section
	 */
	keywordHandleInput: function(e) {
		var el = e.currentTarget;
		el.value = el.value.trim();

		/* If spacebar/return is pressed then add a keyword bubble with the text
		 * inside the bubble, if it's not empty.
		 */
		if(e.charCode == 32 || e.charCode == 13 && el.value.length) {
			this.keywordAdd(el.value.trim());
			el.value = "";
		}
	},


	/**
	 * Get the string equivalent of all the keywords in the keyword container.
	 */
	keywordGetText: function() {
		var ret = "";

		/* Iterate through each of the keywords and concatenate it's values
		 * into 'ret'. */
		var $keywords = $("#filter-box-keywords .keyword");
		$keywords.each(function(i) {
			var $el = $($keywords.get(i));
			ret += $el.text() + " ";
		});

		return ret.trim();
	},


	/**
	 * Gets the price from the prices boxes
	 */
	getPriceRange: function() {
		var max = this.$el.find("input[name=\"maxprice\"]").val();
		var min = this.$el.find("input[name=\"minprice\"]").val();
		var exact = this.$el.find("input[name=\"exactprice\"]").val();

		if($("#price-selector :selected").val() == "Exact")
			return {max: exact, min: exact};
		return {max: max, min: min};
	},

	/**
	 * Gather the filterbox's data and prepare a GET request for the new
	 * query.
	 */
	submit: function() {
		// Flush any remain keywords
		this.keywordAdd(this.$el.find("#filter-box-keyword-input").val());


		var data = {
			cat:      this.$el.find("select[name=\"cat\"] :selected").val(),
			keywords: this.keywordGetText(),
			location: this.$el.find("select[name=\"location\"] :selected").val(),
			maxprice: this.getPriceRange().max,
			minprice: this.getPriceRange().max
		};

		/* Validate submit data */
		// if(!validate(data)) return;

		/* Generate the new URL, and go to it */
		var newUrl = window.app.helpers.url.reconstruct(data);
		window.location = newUrl;
	},


	/**
	 * Populate the box with the given data. This function is meant to be used
	 * with the GET parameters.
	 */
	populateBox: function(data) {
		var that = this;

		/* Add the keywords */
		if(data.keywords.length) {
			var keywords = data.keywords.trim().split(" ");
			keywords.forEach(function(keyword, i) {
				that.keywordAdd(keyword);
			});
		}

		/* The price options */
		this.setPriceRange(data.minprice, data.maxprice)
		this.$el.find("select[name=\"location\"]").val(data.location);
		this.setSubCategory(data.cat);
	},



	initialize: function() {
		var that = this;
		this.render();
		this.initCategories();

		/* Start populating the box with contents from the URL */
		var data = {
			cat: window.app.helpers.url.getParam("cat"),
			keywords: window.app.helpers.url.getParam("keywords"),
			minprice: window.app.helpers.url.getParam("minprice"),
			location: window.app.helpers.url.getParam("location"),
			maxprice: window.app.helpers.url.getParam("maxprice")
		};
		this.populateBox(data);

		/* Connect the keypress function to the keyword's handler */
		$("#filter-box-keyword-input").keypress(function(e) {
			that.keywordHandleInput(e);
		});
	},

	render: function() {
		this.$el.html(this.template(window.data));
	}
});