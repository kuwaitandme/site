module.exports = Backbone.View.extend
	name: '[view:classified-post:images]'
	events: 'click .dz-preview .delete div': 'removeFile'

	initialize: (options) ->
		if options.model then @model = options.model
		if options.$el   then   @$el = options.$el

		@$filePreview = @$ '#image-upload-preview'

		@on "close", @close

		# Initialize the dropzone
		@initDropzone()

		@setDOM()


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
		((@$filePreview.find 'li').eq index).remove()

		# Remove it from the file Queue
		@dropzone.files[index].status = 'delete'


	# Initializes the drop-zone
	initDropzone: ->
		Dropzone.autoDiscover = false

		# Create the dropzone
		$el = ((@$ '#image-upload').eq 0).dropzone url: '/'
		@dropzone = $el[0].dropzone
		@dropzone.previewsContainer = @$filePreview[0]

		# Setup each of the custom options for the drop-zone
		options = @dropzone.options
		options.autoProcessQueue = false
		options.paramName = 'files'
		options.uploadMultiple = true
		options.previewTemplate = '
			<li class="dz-preview">\
				<img data-dz-thumbnail />\
				<div class="font-awesome delete">\
					<div>&#xf00d;</div>\
				</div>
			</li>'


	setModel: ->
		# Start grabbing the files from the drop-zone
		files = @dropzone.getQueuedFiles()

		# Append each file into the model
		@model.attributes.files = []
		for file in files
			@model.attributes.files.push file


	setDOM: ->


	close: ->
		@remove()
		@unbind()
		@stopListening()