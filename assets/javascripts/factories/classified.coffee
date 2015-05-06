exports = module.exports = ($http) ->
  class Model
    name: "[model:classified]"


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
      .success (response) -> callback null, response
      .error (response) -> callback response


    query: (parameters, callback) ->
      $http.get "/api/classified?#{@_serializeGET parameters}"
      .success (classifieds) =>
        @_parse classified for classified in classifieds
        callback null, classifieds
      .error callback


    get: (id, callback) ->
      $http.get "/api/classified/#{id}"
      .success (classified) => callback null, @_parse classified
      .error callback


    getBySlug: (slug, callback) ->
      $http.get "/api/classified/slug/#{slug}"
      .success (classified) => callback null, @_parse classified
      .error callback


    getDefault: ->
      contact:       {}
      filesToDelete: []
      images:        []
      meta:          {}
      perks:         {}
      reports:       []


    _parse: (classified) ->
      # Sets the social links
      tweet    = "Check out my classified at #{URL}"
      classified.social =
        facebook: "https://www.facebook.com/sharer/sharer.php?u=#{URL}"
        gplus:    "https://plus.google.com/share?url=#{URL}"
        twitter:  "https://twitter.com/home?status=#{encodeURI tweet}"
        email:    "mailto:?subject=Checkout this classified: '#{classified.title}'
          &body=link to the classified: #{URL}"
      classified


    _getFormdata: (classified) ->
      formdata = new FormData

      # Extract the images
      images = classified.images or []
      delete classified.images

      data =
        title: classified.title
        description: classified.description
        parent_category: classified.parentCategory.id
        child_category: classified.childCategory.id
        location: classified.location.id
        priceType: classified.priceType
        priceValue: classified.priceValue
        contact: classified.contact
        images: classified.images
        meta: classified.meta
        type: classified.type

      # Prepare the formdata object
      formdata.append "classified", angular.toJson data
      for image in images then if image.status is "to-upload"
        formdata.append "images[]", image.file
      formdata


  new Model


exports.$inject = ["$http"]