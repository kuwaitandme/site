exports = module.exports = ($environment, $location, $http, console) -> new class
  name: "[model:classified]"

  defaults:
    contact:       {}
    # filesToDelete: []
    images:        []
    meta:          {}

  statuses:
    INACTIVE: 0
    ACTIVE: 1
    REJECTED: 2
    ARCHIVED: 3
    BANNED: 4
    FLAGGED: 5
    VERIFIED: 6
    EXPIRED: 7

  languages:
    ENGLISH: 1
    ARABIC:  2
    HINDI:   3


  # Serialize the object into a format recognized by HTTP "GET"
  _serializeGET: (obj) ->
    str = []
    for p of obj then if obj.hasOwnProperty p
      str.push "#{encodeURIComponent p}=#{encodeURIComponent obj[p]}"
    str.join '&'


  save: (classified={}, callback=->) ->
    if not classified.id?
      method = "POST"
      url = "/api/classifieds"
    else
      method = "PUT"
      url = "/api/classifieds/#{classified.id}"
    console.log @name, "sending classified to server [#{method}]"
    console.debug @name, classified
    # Convert the json array into a formdata object
    formdata = @_getFormdata classified
    # Send the request with a 'multi-part/formdata' encoding.
    $http
      url: url
      data: formdata
      method: method
      transformRequest: angular.identity
      headers: "Content-Type": undefined
    .success (classified) => callback null, @_parse classified
    .error (response) -> callback response


  query: (parameters, callback) ->
    $http.get "/api/classifieds?#{@_serializeGET parameters}"
    .success (classifieds) =>
      callback null, (@_parse classified for classified in classifieds)
    .error callback


  get: (id, callback) ->
    $http.get "/api/classifieds/#{id}"
    .success (classified) => callback null, @_parse classified
    .error callback


  getBySlug: (slug, callback) ->
    $http.get "/api/classifieds/slug/#{slug}"
    .success (classified) => callback null, @_parse classified
    .error callback


  # This function simple returns a blank classified with the default fields
  getDefault: -> @_parse new => @defaults


  # This function is run with every classified that is fetched from the API.
  # This makes sure that all necessary fields are parsed and extra fields (for
  # front-end purposes only) are also set.
  _parse: (classified) ->
    cl = {}
    # First off give any defaults if needed.
    angular.extend cl, @defaults, classified
    # Sets the social links
    SOURCE = "https://#{$location.host()}"
    URL = "https://#{$location.host()}/#{cl.slug}"
    tweet    = "Check out this classified, #{URL}"
    cl.social =
      facebook: "https://www.facebook.com/sharer/sharer.php?u=#{URL}"
      gplus:    "https://plus.google.com/share?url=#{URL}"
      twitter:  "https://twitter.com/home?url=#{URL}&status=#{encodeURI tweet}"
      email:    "mailto:?subject=Checkout this cl: '#{cl.title}'
        &body=<your message>%0D%0A%0D%0Aurl: #{URL}"
      reddit:   "http://www.reddit.com/submit?url=#{URL}&title=#{encodeURI cl.title}"
      linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=#{URL}&title=#{cl.title}&summary=#{cl.description}&source=#{SOURCE}"
    # Find and set the main image
    for image in (cl.images or [])
      cl.mainImage = image
      imageURL = "#{$environment.staticUrl}/uploads/main/#{image.filename}"
      cl.social.pintrest = "https://pinterest.com/pin/create/button/?url=#{URL}&media=#{imageURL}&description=#{cl.title}"
      if image.main? and image.main then break
    # Setup special variables for ENUM-type objects
    switch cl.status
      when @statuses.ACTIVE   then cl.isActive    = true
      when @statuses.ARCHIVED then cl.isArchived  = true
      when @statuses.BANNED   then cl.isBanned    = true
      when @statuses.EXPIRED  then cl.hasExpired  = true
      when @statuses.INACTIVE then cl.underReview = true
      when @statuses.REJECTED then cl.isRejected  = true
    switch cl.language
      when @languages.ARABIC  then cl.isArabic  = true
      when @languages.ENGLISH then cl.isEnglish = true
    # Set the delivery variables
    if cl.meta.deliveryIncluded
      if not cl.meta.freeDeliveryIncluded then cl.hasDelivery = true
      else cl.hasFreeDelivery = true
    # Return the modified classified
    cl


  # This helper function is used during classified posting/editing to create a
  # FormData object which can then be used to send to the server.
  _getFormdata: (classified) ->
    fileIndex = 0
    hasMainImage = false
    newImages = []
    # Extract the images
    images = classified.images or []
    delete classified.images
    # Prepare the formdata object
    formdata = new FormData
    # start parsing each image
    for image in images
      if image.status is "to-upload"
        if image.main then hasMainImage = true
        # Add all new images into a different variable, and add each image as
        # a separate field in the fromdata object.
        formdata.append "images[]", image.file, image.file.name
      else if image.status is "to-delete-from-server"
        classified.filesToDelete ?= []
        classified.filesToDelete.push image.filename
      # Remove unwanted fields (that are not supposed be passed to the server this way)
      delete image.src
      delete image.file
      delete image.status
    # If a main image has not been found, then set one.
    if not hasMainImage and newImages.length > 0 then newImages[0].main = true
    # Finally convert the classified into a JSON string and send it to the
    # server.
    classified.new_images = newImages
    classified.images = images
    formdata.append "classified", angular.toJson classified
    formdata


  # A helper function which can be used to convert a base64 encoded image into
  # HTML FormData object.
  _dataURItoBlob: (dataURI) ->
    base64ToBlob = (base64, contentType="", sliceSize=512) ->
      byteCharacters = atob base64
      byteArrays = []
      offset = 0
      while offset < byteCharacters.length
        slice = byteCharacters.slice offset, offset + sliceSize
        byteNumbers = new Array slice.length
        i = 0
        while i < slice.length
          byteNumbers[i] = slice.charCodeAt i
          i++
        byteArray = new Uint8Array byteNumbers
        byteArrays.push byteArray
        offset += sliceSize
      new Blob byteArrays, type: contentType

    matched = dataURI.match /data:(\w+\/\w+);base64,(.+)/
    base64ToBlob matched[2], matched[1]


exports.$inject = [
  "$environment"
  "$location"
  "$http"
  "$log"
]