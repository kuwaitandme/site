module.exports = Backbone.View.extend({
	postURL: '/classified/post',

	events: {
		"click .dz-preview .delete div" : "removeFile",
		"click .submit" : "submit",
		"click .price" : "managePayment",
		"change #cat-selector" : "catSelected",
		"change #price-selector" : "priceSelected",
		"change #locations" : "unlockMapAndAddress"
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
		// status &= setError($phone, isTextValid) ||
		// 	setError($email, isTextValid);

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

		var captcha = $("#g-recaptcha-response").val();

		/* Send the AJAX request and redirect */
		$.ajax({
			url: this.postURL + "?captcha=" + captcha,
			type: "POST",
			data: data,
			processData: false,
			contentType: false,
			success: function(response) {
				switch(response.status) {
					case "success":
						/* Create the finish URL */
						var href = "/guest/finish/" + response.id;
						if(response.authHash) href += "?authHash=" + response.authHash;

						/* Redirect to this URL */
						window.location.href = href;
						break;
					default:
						/* Handle errors here */
				}
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
				this.$priceField.val(0);
				this.$priceField.hide();
				break;
			case "Custom":
				this.$priceField.val(null);
				this.$priceField.show();
				break;
			case "Contact Owner":
				this.$priceField.val(-1);
				this.$priceField.hide();
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
		var categories = window.categories;

		this.$subCategory.show();
		this.$subCategory.removeAttr("disabled");

		for(var i=0; i<categories.length; i++)
			if(categories[i]._id == id) {
				var children = categories[i].children;

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
	 * Unlocks the map and address fields.
	 */
	unlockMapAndAddress: function(e) {
		var lastVal = this.$locations.find('option:last-child').val();

		/* Check if we selected the last option or not. If we have, then disable
		 * the map and the address fields */
		if(this.$locations.val() != lastVal) {
			$("[name='address1']").removeAttr("disabled");
			$("[name='address2']").removeAttr("disabled");
			$("#map-overlay").hide();
		} else {
			$("[name='address1']").attr("disabled", "");
			$("[name='address2']").attr("disabled", "");
			$("#map-overlay").show();
		}
	},


	/**
	 * Initializes the categories option.
	 */
	initCategories: function() {
		this.$subCategory.hide();

		var categories = window.categories;
		for(var i=0; i<categories.length; i++) {
			var html = this.generateOption(categories[i]._id, categories[i].name);
			this.$parCategory.append(html);
		}
	},


	/**
	 * Initializes the locations.
	 */
	initLocations: function () {
		var locations = window.locations;
		for(var i=0; i<locations.length; i++) {
			var html = this.generateOption(locations[i]._id, locations[i].name);
			this.$locations.append(html);
		}
	},


	/**
	 * Initializes the drop-zone.
	 */
	initDropzone: function() {
		Dropzone.autoDiscover = false;

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


	/**
	 * Initializes Google maps
	 */
	initMaps: function() {
		var that = this;

		function init() {
			var myLatlng = new google.maps.LatLng(29.27985, 47.98448)
			var mapOptions = {
				center: myLatlng,
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				draggable: false,
				zoom: 13,
			}
			that.gmap = new google.maps.Map(that.$gmap[0], mapOptions);

			that.gmarker = new google.maps.Marker({
				draggable: true,
				map: that.gmap,
				position: myLatlng
			});


			google.maps.event.addListener(that.gmarker, 'dragend',
				function (event) {
					/* Center the map on the position of the marker */
					var latLng = that.gmarker.getPosition();
					that.gmap.setCenter(latLng);

					/* Set our hidden input fields so that the backend can catch
					 * it */
					that.$gmapX.val(latLng.lat());
					that.$gmapY.val(latLng.lng());
			});
		}
		init();
	},

	initialize: function(obj) {
		/* Setup our DOM variables */
		this.$filePreview = this.$el.find("#image-upload-preview");
		this.$parCategory = this.$el.find("#cat-selector");
		this.$locations = this.$el.find("#locations");
		this.$priceField = this.$el.find('#price-field');
		this.$priceSelector = this.$el.find("#price-selector");
		this.$subCategory = this.$el.find("#subcat-selector");

		this.$gmap = this.$el.find("#map-canvas");
		this.$gmapX = this.$el.find("[name='gmapX']");
		this.$gmapY = this.$el.find("[name='gmapY']");

		/* Initialize parts of the form */
		this.priceSelected();
		this.initCategories();
		this.initDropzone();
		this.initLocations();
		this.initMaps();
	}
});