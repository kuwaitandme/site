ajax = app.helpers.ajax
async = require 'async'
dateHelper = (require 'app-helpers').date

# A Backbone model representing a single classified. This model contains
# methods to manipulate and sync with the server.
module.exports = Backbone.Model.extend
	defaults:
		_id: null
		adminReason: null
		authHash: null
		category: null
		created: null
		description: ''
		guest: true
		images: []
		owner: null
		price: 0
		reports: []
		status: 0
		title: ''
		type: 0
		views: 0
		perks:
			urgent: false
			promote: false
		contact:
			address1: null
			address2: null
			email: null
			location: null
			phone: null
		meta:
			gmapX: null
			gmapY: null


	initialize: ->
		# set this.id
		@bind 'parse', @parseVariables, this
		return


	fetch: (id) ->
		that = this
		url = app.config.host + '/classified/single/' + id
		$.ajax
			type: 'GET'
			url: url
			dataType: 'json'
			crossDomain: true
			async: false
			beforeSend: ajax.setHeaders
			success: (response) ->
				console.debug '[model:classified] fetching classified details', response
				response.classified.editable = response.editable
				response.classified.superEditable = response.superEditable
				that.set response.classified

				# Signal any listeners that we are done loading this classified
				that.trigger 'ajax:done', that
			error: (e) ->
				console.error '[model:classified] error fetching classified details', e


	parseVariables: ->
		# Set a condition to avoid arguments from being parsed again
		if @attributes.parsed then return
		@attributes.parsed = true

		# Convert the price into 'Free', '## KD' or 'Contact Owner'
		price = @get('price')
		@attributes.price = @priceFormat(price)

		# Convert Date to human readable format
		date = @get('created')
		@attributes.created = dateHelper.prettify(date)


	uploadServer: (captcha, files) ->
		console.debug '[model:classified] uploading classified details to server', this
		that = this
		url = app.config.host + '/classified/post/'

		# Get the JSON to send in the first request. The first request should
		# not contain the files. The files will be uploaded asynchronously in
		# the next request
		json = @toJSON()
		json.files = null

		# A progress handler function to show how much of the file
		# upload is done.
		progressHandler = (event) ->
			if event.lengthComputable
				that.trigger 'ajax:done:partial', event
			# $('progress').attr({value:e.loaded,max:e.total});
			return

		$.ajax
			beforeSend: ajax.setHeaders
			data: @getFormData(files)
			processData: false
			contentType: false
			type: 'POST'
			url: url

			# Attach the progress handler, if it can be supported
			xhr: ->
				Xhr = $.ajaxSettings.xhr()
				if Xhr.upload
					Xhr.upload.addEventListener 'progress', progressHandler, false
				Xhr

			success: (response) ->
				if !response._id
					console.error '[model:classified] error uploading classified', response
					return that.trigger('ajax:error', response)

				# Get the id from the response
				that.set '_id', response._id

				# Let listeners know that we have successfully uploaded the
				# classified
				that.trigger 'ajax:done'

			error: (e) ->
				console.error '[model:classified] error uploading classified details', e
				that.trigger 'ajax:error', e


	getFormData: ->
		formdata = new FormData
		data = @toJSON()
		files = data.files
		delete data.files
		formdata.append 'data', JSON.stringify(data)
		_.each files, (file) ->
			formdata.append 'files[]', file
		formdata


	updateServer: ->


	priceFormat: (price) ->
		if price is 0 then return "Free"
		if price is -1 then return "Contact Owner"
		if price then return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD"