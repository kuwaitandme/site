defaults =
  contact: {}
  images: []
  meta: {}

statuses =
  INACTIVE: 0
  ACTIVE: 1
  REJECTED: 2
  ARCHIVED: 3
  BANNED: 4
  FLAGGED: 5
  VERIFIED: 6
  EXPIRED: 7

languages =
  ENGLISH: 1
  ARABIC:  2
  HINDI:   3


# This helper function is used during classified posting/editing to create a
# FormData object which can then be used to send to the server.
getFormdata = (classified) ->
  fileIndex = 0
  hasMainImage = false
  newImages = []

  # Prepare the formdata object
  formdata = new FormData

  # Extract the images and start parsing it
  images = classified.images or []
  delete classified.images
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

  # Finally convert the classified into a JSON string and send it to the server.
  classified.new_images = newImages
  classified.images = images
  formdata.append "classified", angular.toJson classified
  formdata


# Serialize the object into a format recognized by HTTP "GET"
serializeGET: (obj) ->
  str = []
  for p of obj then if obj.hasOwnProperty p
    str.push "#{encodeURIComponent p}=#{encodeURIComponent obj[p]}"
  str.join '&'


model = ->
model::name = "[model:classified]"

exports = module.exports = ($environment, $location, $http, $log, $q) ->



  model::save = (classified={}, headers) ->
    if not classified.id?
      method = "POST"
      url = "#{$environment.url}/api/classifieds"
    else
      method = "PUT"
      url = "#{$environment.url}/api/classifieds/#{classified.id}"
    $log.log @name, "sending classified to server [#{method}]"
    $log.debug @name, classified
    # Convert the json array into a formdata object
    formdata = getFormdata classified
    # Send the request with a 'multi-part/formdata' encoding.
    $http
      data: formdata
      headers: angular.extend headers, "Content-Type": undefined
      method: method
      transformRequest: angular.identity
      url: url
    .then parse


  model::query = (parameters) ->
    $http.get "#{$environment.url}/api/classifieds?#{serializeGET parameters}"
    .then parse


  model::get = (id) ->
    $http.get "#{$environment.url}/api/classifieds/#{id}"
    .then parse


  model::getBySlug = (slug) ->
    $http.get "#{$environment.url}/api/classifieds/slug/#{slug}"
    .then parse


  # This function simple returns a blank classified with the default fields
  model::getDefault = -> parse new -> defaults


  # This function is run with every classified that is fetched from the API.
  # This makes sure that all necessary fields are parsed and extra fields (for
  # front-end purposes only) are also set.
  parse = (response) ->
    # First off give any defaults if needed.
    cl = angular.extend defaults, response.data
    # if cl.priceType? then cl.priceType = String cl.priceType
    # # Sets the social links
    # SOURCE = "https://#{$location.host()}"
    # URL = "https://#{$location.host()}/#{cl.slug}"
    # tweet    = "Check out this classified, #{URL}"
    # cl.social =
    #   facebook: "https://www.facebook.com/sharer/sharer.php?u=#{URL}"
    #   gplus: "https://plus.google.com/share?url=#{URL}"
    #   twitter: "https://twitter.com/home?url=#{URL}&status=#{encodeURI tweet}"
    #   email: "mailto:?subject=Checkout this cl: '#{cl.title}'
    #     &body=<your message>%0D%0A%0D%0Aurl: #{URL}"
    #   reddit: "http://www.reddit.com/submit?url=#{URL}&title=#{encodeURI cl.title}"
    #   linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=#{URL}&title=#{cl.title}&summary=#{cl.description}&source=#{SOURCE}"
    # Find and set the main image
    for image in (cl.images or [])
      image.src = "#{$environment.staticUrl}/uploads/thumb/#{image.filename}"
    for image in (cl.images or [])
      cl.mainImage = image
      imageURL = "#{$environment.staticUrl}/uploads/main/#{image.filename}"
      cl.social.pintrest = "https://pinterest.com/pin/create/button/?url=#{URL}&media=#{imageURL}&description=#{cl.title}"
      if image.main? and image.main then break
    # Setup special variables for ENUM-type objects
    switch cl.status
      when statuses.ACTIVE then cl.isActive    = true
      when statuses.ARCHIVED then cl.isArchived  = true
      when statuses.BANNED then cl.isBanned    = true
      when statuses.EXPIRED then cl.hasExpired  = true
      when statuses.INACTIVE then cl.underReview = true
      when statuses.REJECTED then cl.isRejected  = true
    switch cl.language
      when languages.ARABIC then cl.isArabic  = true
      when languages.ENGLISH then cl.isEnglish = true
    # Set the delivery variables
    if cl.meta.deliveryIncluded
      if not cl.meta.freeDeliveryIncluded then cl.hasDelivery = true
      else cl.hasFreeDelivery = true
    # Return the modified classified
    cl


  new model


exports.$inject = [
  "$environment"
  "$location"
  "$http"
  "$log"
  "$q"
]
