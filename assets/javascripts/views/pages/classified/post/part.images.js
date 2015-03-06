module.exports = Backbone.View.extend({
	events: {
		"click .dz-preview .delete div" : "removeFile",
	},

	initialize: function(options) {
		this.model = options.model;
		this.$filePreview = this.$el.find("#image-upload-preview");

		/* Initialize the dropzone */
		this.initDropzone();
	},


	render: function() { },


	validate: function() {
		this.setModel();
		return true;
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


	setModel: function() {
		/* Start grabbing the files from the drop-zone */
		var files = this.dropzone.getQueuedFiles();

		/* Append each file into the model */
		this.model.attributes.files = [];
		for (var i = 0; i < files.length; i++)
			this.model.attributes.files.push(files[i]);
	},
});