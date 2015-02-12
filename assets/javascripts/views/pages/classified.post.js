module.exports = Backbone.View.extend({
	events: {
		"click .dz-preview .delete div" : "removeFile",
		"click .submit" : "submit",
		"change #cat-selector" : "catSelected",
		"change #price-selector" : "priceSelected"
	},


	/**
	 * Validates the form data and returns true, iff the form data is valid for
	 * submission.
	 */
	validate: function(data) {
		var $el;
		var status = true;
		var that = this;

		var $description = this.$el.find("[name=description]"),
			$email = this.$el.find("[name=email]"),
			$location = this.$el.find("[name=location]"),
			$phone = this.$el.find("[name=phone]"),
			$title = this.$el.find("[name=title]");

		/* Shorthand function to display the error class */
		function setError($el, validatingFn) {
			var status = validatingFn($el);

			if(!status) $el.addClass("error");
			else $el.removeClass('error');

			return status;
		}

		/* Shorthand function to see if a field is empty or not */
		function isTextValid($el) { return $el.val().trim().length > 0; }
		/* Shorthand function to see if the category is empty or not */
		function isOptionValid($el) { return $el.val() != null; }

		/* Check the title and description */
		status &= setError($title, isTextValid);
		status &= setError($description, isTextValid);

		/* Check the email and phone */
		status &= setError($phone, isTextValid) ||
			setError($email, isTextValid);

		/* Check the category boxes */
		var catStatus = setError(this.$parCategory, isOptionValid) &&
			setError(this.$subCategory, isOptionValid);
		status &= catStatus;

		/* Check if the location option has been filled out or not */
		status &= setError($location, isOptionValid);

		/* Everything else should be fine as it is. So now check our status and
		 * hopefully it should be false if one the fields failed to validate */
		if(!status) app.messages.shout("Some fields are required. Please fill" +
			" the highlighted fields");
		return status;
	},


	/**
	 * Sends the AJAX request to the back-end
	 */
	submit: function(event) {
		event.preventDefault();

		/* Get and validate the form data */
		var data = this.getFormData();
		if(!this.validate(data)) return;
		var that = this;

		/* Send the AJAX request and redirect */
		$.ajax({
			url: document.URL,
			type: "POST",
			data: data,
			processData: false,
			contentType: false,
			success: function(response) {
				/* 'response' contains the string URL to redirect to */
				window.location.href = response;
			}
		});
	},



	/**
	 * Handler function to remove the file from the Uploads queue.
	 */
	removeFile: function(event) {
		/* Find the index of the file */
		var $el = $(event.currentTarget);
		var index = $el.parent().parent().index();

		/* Remove it from the DOM */
		this.$filePreview.find("li").eq(index).remove();

		/* Remove it from the file Queue */
		this.dropzone.files[index].status = "delete";
	},


	/**
	 * Handler function to change the price boxes
	 */
	priceSelected: function(event) {
		var val =  this.$priceSelector.find(":selected").val();
		switch(val) {
			case "Free":
				this.setPrice(0);
				this.hidePrice();
				break;
			case "Custom":
				this.setPrice(null);
				this.showPrice();
				break;
			case "Contact Owner":
				this.setPrice(-1);
				this.hidePrice();
				break;
		}
	},


	/**
	 * Hides the price range boxes
	 */
	hidePrice: function() {
		this.$el.find("#price-container").hide();
	},


	/**
	 * Shows the price range boxes
	 */
	showPrice: function() {
		this.$el.find("#price-container").show();
	},


	/**
	 * Sets the price range boxes.
	 */
	setPrice: function(price) {
		this.$el.find("input[name=\"price\"]").val(price);

		if(price == 0) {
			this.$priceSelector.val("Free");
			this.hidePrice();
		} else if(price == -1) {
			this.$priceSelector.val("Contact Owner");
			this.hidePrice();
		} else if(price) {
			this.$priceSelector.val("Range");
			this.showPrice();
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
		var categories = window.categories;

		for(var i=0; i<categories.length; i++)
			if(categories[i].id == id) {
				var children = categories[i].children;

				this.$subCategory.html(
					this.generateOption(0, "Choose a sub-category", true)
				);
				for(var j=0; j<children.length; j++) {
					var html = this.generateOption(children[j].id,
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
		var categories = window.categories;
		for(var i=0; i<categories.length; i++) {
			var html = this.generateOption(categories[i].id, categories[i].name);
			this.$parCategory.append(html);
		}
	},


	/**
	 * Initializes the locations.
	 */
	initLocations: function () {
		var locations = window.locations;
		for(var i=0; i<locations.length; i++) {
			var html = this.generateOption(locations[i].id, locations[i].name);
			this.$locations.append(html);
		}
	},


	/**
	 * Initializes the drop-zone.
	 */
	initDropzone: function() {
		/* Create the dropzone */
		var $el = this.$el.find("#image-upload").eq(0).dropzone({ url: "/" });
		this.dropzone = $el[0].dropzone;
		this.dropzone.previewsContainer = this.$filePreview[0];

		/* Setup each of the custom options for the drop-zone */
		var options = this.dropzone.options
		options.autoProcessQueue = false;
		options.paramName = "files";
		options.uploadMultiple = true;
		options.previewTemplate = "\
			<li class=\"dz-preview\">\
				<img data-dz-thumbnail />\
				<div class=\"font-awesome delete\">\
					<div>&#xf00d;</div>\
				</div>\
			</li>";
	},


	/**
	 * Gets all the form data from the page, into a local variable and returns
	 * it.
	 */
	getFormData: function() {
		var $form = this.$el.find("form");

		/* Get the files and perform a nice little hack on the AJAX upload */
		var files = this.dropzone.getQueuedFiles();
		if(files.length == 0) $form.append('<input name="files[]" type="file" class="hide" />');

		/* Create the form data object */
		var formData = new FormData($form[0]);

		/* Start grabbing the files from the drop-zone */
		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			/* Add the file to the request. */
			formData.append('files[]', file, file.name);
		}

		return formData;
	},


	initialize: function(obj) {
		var url = document.URL;

		/* Get the type of the classified. "classified" or "guest" */
		var type = url.split("/")[4];

		/* Setup our DOM variables */
		this.$filePreview = this.$el.find("#image-upload-preview");
		this.$parCategory = this.$el.find("#cat-selector");
		this.$locations = this.$el.find("#locations");
		this.$priceSelector = this.$el.find("#price-selector");
		this.$subCategory = this.$el.find("#subcat-selector");

		/* Initialize parts of the form */
		this.initCategories();
		this.initDropzone();
		this.initLocations();
	},


	render: function() {
		this.setPrice(null);
		if(this.getValues) this.getValues();
	}
});