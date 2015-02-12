module.exports = Backbone.View.extend({
	events: {
		"change #cat-selector": "catSelected",
		"change #subcat-selector": "subcatSelected"
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


	subcatSelected: function(e) {
		var id = this.$el.find("#subcat-selector :selected").data("id");
		location = lang.href + "/classified/search/?cat=" + id;
	},


	/**
	 * Handler function to change the subcategory select box based on the parent
	 * select option.
	 */
	catSelected: function(e) {
		var id = this.$el.find("#cat-selector :selected").data("id");
		var categories = app.data.categories;

		for(var i=0; i<categories.length; i++)
			if(categories[i].id == id) {
				var children = categories[i].children;

				this.$el.find("#subcat-selector").html(
					this.generateOption(0, "Choose a sub-category", true)
				);
				for(var j=0; j<children.length; j++) {
					var html = this.generateOption(children[j].id,
						children[j].name);
					this.$el.find("#subcat-selector").append(html);
				}

				return;
			}
	},

	/**
	 * Initializes the categories option.
	 */
	initCategories: function() {
		var categories = app.data.categories;

		for(var i=0; i<categories.length; i++) {
			var html = this.generateOption(categories[i].id, categories[i].name);
			this.$el.find("#cat-selector").append(html);
		}
	},

	setupMasonry: function() {
		var that = this;
		this.topMasonry = new Masonry(this.$topClassifieds[0], {
			columnWidth: 1,
			// isFitWidth true,
			itemSelector: '.top-c'
		});
		imagesLoaded(this.$topClassifieds, function() { that.topMasonry.layout(); });

		this.bottomMasonry = new Masonry(this.$categoryList[0], {
			columnWidth: 10,
			isFitWidth: true,
			itemSelector: '.m-item'
		});
	},

	initialize: function() {
		this.$topClassifieds = $('#top-classifieds');
		this.$categoryList = $('#masonry-container');

		this.render.topClassifieds(this);
		this.render.categories(this);
		this.setupMasonry();
	},


	render: {
		topClassifieds: function(that) {
			var topClassifiedsTemplate = _.template(
				$("#top-classifieds-template").html());
			that.$topClassifieds.html("");

			for(var i=0; i<data.topClassifieds.length; i++) {
				var classified = data.topClassifieds[i];

				/* Protect the 'thumb' variable */
				if(!classified.thumb) classified.thumb = null;

				/* Render out the top classifieds */
				var html = topClassifiedsTemplate(classified);
				that.$topClassifieds.append(html);
			}
		},
		categories: function (that) {
			var categoriesTemplate = _.template(
				$("#list-template").html());
			that.$categoryList.html("");

			var categories = app.helpers.category.rearrange(window.categories);

			for(var i=0; i<categories.length; i++) {
				/* Render out the category */
				var html = categoriesTemplate(categories[i]);
				that.$categoryList.append(html);
			}
		}
	}
});