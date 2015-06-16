class Classified
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

  defaults:
    contact: {}
    images: []
    meta: {}

  constructor: (data) -> @set data

  isSaved: -> @cl.id?

  # To check for classified status
  isActive: -> @cl.status is @statuses.ACTIVE
  isBanned: -> @cl.status is @statuses.BANNED
  isInactive: -> @cl.status is @statuses.INACTIVE
  isRejected: -> @cl.status is @statuses.REJECTED

  # To check for language
  isEnglish: -> @cl.languages is @languages.ENGLISH
  isArabic: -> @cl.languages is @languages.ARABIC
  isHindi: -> @cl.languages is @languages.HINDI

  # To check for delivery status
  hasDelivery: -> @cl.meta.deliveryIncluded
  hasFreeDelivery: -> @cl.meta.freeDeliveryIncluded


  # This function returns the main image for the classified. If it doesn't have
  # a main image, then it finds one.
  mainImage: ->
    for image in (@cl.images or [])
      img = image
      if image.main then break
    img


  # These get and set methods properly set/get the classified taking care of
  # any missing data.
  get: -> @cl
  set: (data) -> @cl = angular.extend @defaults, data



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


exports = module.exports = ($environment, $location, $http, $serialize, $log) ->
  name = "[model:classified]"
  API = "#{$environment.url}/api/classifieds"

  # This function is run with every classified that is fetched from the API.
  # This makes sure that all necessary fields are parsed and extra fields (for
  # front-end purposes only) are also set.
  parseResponse = (response) -> parse response.data
  parse = (data={}) ->
    # Sets the social links
    source = "https://#{$location.host()}"
    url = "https://#{$location.host()}/#{data.slug}"
    tweet    = "Check out this classified, #{url}"
    data.social =
      facebook: "https://www.facebook.com/sharer/sharer.php?u=#{url}"
      gplus: "https://plus.google.com/share?url=#{url}"
      twitter: "https://twitter.com/home?url=#{url}&status=#{encodeURI tweet}"
      email: "mailto:?subject=Checkout this classified: '#{data.title}'
        &body=<your message>%0D%0A%0D%0Aurl: #{url}"
      reddit: "http://www.reddit.com/submit?url=#{url}
        &title=#{encodeURI data.title}"
      linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=#{url}
        &title=#{data.title}&summary=#{data.description}&source=#{source}"

    # Give a proper src for each of the images
    for image in (data.images or [])
      image.src = "#{$environment.staticUrl}/uploads/thumb/#{image.filename}"
      image.srcMain = "#{$environment.staticUrl}/uploads/main/#{image.filename}"
    data

  class Model
    constructor: ->
      $log.log name, "initializing"
      cl = new Classified
      @statuses = cl.statuses
      @languages = cl.languages


    toModel: (data) -> new Classified parse data


    save: (classified={}, headers) ->
      if not classified.id?
        method = "POST"
        url = "#{API}"
      else
        method = "PUT"
        url = "#{API}/#{classified.id}"
      $log.log name, "sending classified to server [#{method}]"
      $log.debug name, classified
      # Convert the json array into a formdata object
      formdata = getFormdata classified
      # Send the request with a 'multi-part/formdata' encoding.
      $http
        data: formdata
        headers: angular.extend headers, "Content-Type": undefined
        method: method
        transformRequest: angular.identity
        url: url
      .then parseResponse


    query: (parameters) ->
      $log.log name, "querying for classifieds from server"
      $log.debug name, "query", parameters
      query = $serialize parameters
      $http.get "#{API}?#{query}"


    # Returns a classified given it's id
    get: (id) ->
      $log.log name, "fetching classified from server by id"
      $log.debug name, "id", id
      $http.get("#{API}/#{id}").then parseResponse


    # Returns a classified given it's slug
    getBySlug: (slug) ->
      $log.log name, "fetching classified from server by slug"
      $log.debug name, "slug", slug
      $http.get("#{API}/slug/#{slug}").then parseResponse


    # This function simple returns a blank classified with the default fields
    getDefault: -> parse new -> defaults


  new Model


exports.$inject = [
  "$environment"
  "$location"
  "$http"
  "$httpParamSerializer"
  "$log"
  "$q"
]
