# This file contains a Backbone.Model representing a single classified. This
# model contains methods to manipulate and sync with the server as well take
# care of minor details like XSS and making things readable.

async = require 'async'
helpers = require 'app-helpers'

dateHelper = helpers.date
ajax = helpers.ajax

# A
module.exports = Backbone.Model.extend
  idAttribute: "_id"
  name: "[model:classified]"

  url: ->
    id = @id
    if id then return "/api/classified/#{id}"
    else '/api/classified'

  defaults:
    _id: null
    moderatorReason: null
    authHash: null
    category: null
    childCategory: null
    babyCategory: null
    created: null
    description: ''
    guest: true
    images: []
    owner: null
    price: null
    reports: []
    location: null
    status: 0
    title: ''
    type: null
    views: 0
    perks:   {}
    contact: {}
    meta:    {}

  # These status are copied from the server's model for a classified
  status:
    INACTIVE: 0
    ACTIVE: 1
    REJECTED: 2
    ARCHIVED: 3
    BANNED: 4
    FLAGGED: 5
    VERIFIED: 6
    EXPIRED: 7

  initialize: -> @bind 'parse', @parseVariables, this


  # This function parses the attributes of the classified when it comes from
  # the server. The only parsing that is ever done here is the making the
  # date and the price in a nice human readable format.
  parseVariables: ->
    # Set a condition to avoid arguments from being parsed again
    if @attributes.parsed then return
    @attributes.parsed = true

    # Convert the price into 'Free', '## KD' or 'Contact Owner'
    price = @get 'price'
    @attributes.price = @priceFormat price

    # Convert Date to human readable format
    date = @get 'created'
    @attributes.created = dateHelper.prettify date


  # This function is used to create a request to create a classified on the
  # server. It takes care of all the minor details like uploading the images
  # and handling the data as well as triggering the right backbone events.
  uploadServer: (captcha, files) ->
    console.debug @name, 'uploading classified details to server', this

    # Get the JSON to send in the first request. The first request should
    # not contain the files. The files will be uploaded asynchronously in
    # the next request
    json = @toJSON()
    json.files = null

    # A progress handler function to show how much of the file
    # upload is done.
    progressHandler = (event) =>
      if event.lengthComputable
        @trigger 'ajax:done:partial', event
      # $('progress').attr({value:e.loaded,max:e.total});
      return

    $.ajax
      beforeSend: ajax.setHeaders
      contentType: false
      data: @getFormData(files)
      processData: false
      type: if (@get '_id')? then "PUT" else "POST"
      url: "#{App.Resources.Config.hostname}/api/classified"

      # Attach the progress handler, if it can be supported
      xhr: ->
        Xhr = $.ajaxSettings.xhr()
        if Xhr.upload
          Xhr.upload.addEventListener 'progress', progressHandler, false
        Xhr

      success: (response) =>
        if not response._id
          console.error @name, 'error uploading classified', response
          return @trigger 'ajax:error', response

        # Set the data from the response
        @set response

        # Let listeners know that we have successfully uploaded the
        # classified
        @trigger 'ajax:done'

      error: (response) =>
        console.error @name, 'error uploading classified details', response
        @trigger 'ajax:error', response


  # This function create a HTML formdata object that contains all the data
  # for the POST/PUT request to the server. This is mandatory as we can't
  # handle files in any other way than multipart/form-data uploads and
  # finding a way to send these files can be a bitch.
  getFormData: ->
    formdata = new FormData
    data = @toJSON()

    files = data.files
    delete data.files

    # Populate the formdata with the JSON and the filemeta
    formdata.append 'data', JSON.stringify data
    for file in files then formdata.append 'files[]', file

    formdata

  # A simple function that converts the price into a nice readable format
  priceFormat: (price) ->
    if price is 0 then "Free"
    else if price is -1 then "Contact Owner"
    else "#{price.toString().replace /\B(?=(\d{3})+(?!\d))/g, ','} KD"