exports = module.exports = ($location, $http, console) -> new class
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
    if not classified._id?
      method = "POST"
      url = "/api/classified"
    else
      method = "PUT"
      url = "/api/classified/#{classified._id}"
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
    $http.get "/api/classified?#{@_serializeGET parameters}"
    .success (classifieds) =>
      callback null, (@_parse classified for classified in classifieds)
    .error callback


  get: (id, callback) ->
    $http.get "/api/classified/#{id}"
    .success (classified) => callback null, @_parse classified
    .error callback


  getBySlug: (slug, callback) ->
    $http.get "/api/classified/slug/#{slug}"
    .success (classified) => callback null, @_parse classified
    .error callback


  # This function simple returns a blank classified with the default fields
  getDefault: -> @_parse new -> @defaults


  # This function is run with every classified that is fetched from the API.
  # This makes sure that all necessary fields are parsed and extra fields (for
  # front-end purposes only) are also set.
  _parse: (classified) ->
    cl = {}
    # First off give any defaults if needed.
    angular.extend cl, @defaults, classified
    # Sets the social links
    URL = "https://#{$location.host()}/#{cl.slug}"
    tweet    = "Check out this classified, #{URL}"
    cl.social =
      facebook: "https://www.facebook.com/sharer/sharer.php?u=#{URL}"
      gplus:    "https://plus.google.com/share?url=#{URL}"
      twitter:  "https://twitter.com/home?status=#{encodeURI tweet}"
      email:    "mailto:?subject=Checkout this cl: '#{cl.title}'
        &body=<your message>%0D%0A%0D%0Aurl: #{URL}"

    # Find and set the main image
    for image in (cl.images or [])
      cl.mainImage = image
      if image.main? and image.main then break

    # Setup special variables for ENUM-type objects
    switch cl.status
      when @statuses.ACTIVE   then cl.isActive    = true
      when @statuses.ARCHIVED then cl.isArchived  = true
      when @statuses.REJECTED then cl.isRejected  = true
      when @statuses.BANNED   then cl.isBanned    = true
      when @statuses.INACTIVE then cl.underReview = true
      when @statuses.EXPIRED  then cl.hasExpired  = true
    switch cl.language
      when @languages.ENGLISH then cl.isEnglish = true
      when @languages.ARABIC  then cl.isArabic  = true

    # Set the delivery variables
    if cl.meta.deliveryIncluded
      if not cl.meta.freeDeliveryIncluded then cl.hasDelivery = true
      else cl.hasFreeDelivery = true

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

    # start individually adding each image as a seperate blob into the formdata
    for image in images then if image.status is "to-upload"
      if image.main then hasMainImage = true

      # Add all new images into a different variable, and add each image as
      # a separate field in the fromdata object.
      newImages.push id: fileIndex, main: image.main
      formdata.append "images[]", image.file, "#{fileIndex}"
      fileIndex++

    # If a main image has not been found, then set one.
    if not hasMainImage and newImages.length > 0 then newImages[0].main = true

    # Finally convert the classified into a JSON string and send it to the
    # server.
    classified.new_images = newImages
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
  "$location"
  "$http"
  "$log"
]