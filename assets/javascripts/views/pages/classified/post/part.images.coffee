module.exports = Backbone.View.extend
	events:
		'click .dz-preview .delete div': 'removeFile'

	initialize: (options) ->
		@model = options.model
		@$filePreview = @$el.find('#image-upload-preview')

		# Initialize the dropzone
		@initDropzone()


	render: ->


	validate: ->
		@setModel()
		true


	# Handler function to remove the file from the Uploads queue
	removeFile: (event) ->
		# Find the index of the file
		$el = $(event.currentTarget)
		index = $el.parent().parent().index()

		# Remove it from the DOM
		@$filePreview.find('li').eq(index).remove()

		# Remove it from the file Queue
		@dropzone.files[index].status = 'delete'


	# Initializes the drop-zone
	initDropzone: ->
		Dropzone.autoDiscover = false

		# Create the dropzone
		$el = @$el.find('#image-upload').eq(0).dropzone(url: '/')
		@dropzone = $el[0].dropzone
		@dropzone.previewsContainer = @$filePreview[0]

		# Setup each of the custom options for the drop-zone
		options = @dropzone.options
		options.autoProcessQueue = false
		options.paramName = 'files'
		options.uploadMultiple = true
		options.previewTemplate = "\
			<li class=\"dz-preview\">\
				<img data-dz-thumbnail />\
				<div class=\"font-awesome delete\">\
					<div>&#xf00d;</div>\
				</div>\
			</li>"


	setModel: ->
		# Start grabbing the files from the drop-zone
		files = @dropzone.getQueuedFiles()

		# Append each file into the model
		@model.attributes.files = []
		i = 0
		while i < files.length
			@model.attributes.files.push files[i]
			i++