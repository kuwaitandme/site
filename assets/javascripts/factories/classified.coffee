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
        meta: classified.meta
        type: classified.type

      hasMainImage = false

      # Prepare the formdata object
      fileIndex = 0
      newImages = []
      for image in images then if image.status is "to-upload"
        if image.main then hasMainImage = true

        # Add all new images into a different variable, and add each image as
        # a separate field in the fromdata object.
        newImages.push id: fileIndex, main: image.main
        formdata.append "images[]", (@_dataURItoBlob image.file), "#{fileIndex}"
        fileIndex++

      # If a main image has not been found, then set one.
      if not hasMainImage and newImages.length > 0 then newImages[0].main = true

      data.new_images = newImages
      formdata.append "classified", angular.toJson data
      formdata


    _dataURItoBlob: (dataURI) ->
      matched = dataURI.match /data:(\w+\/\w+);base64,(.+)/

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

      base64ToBlob matched[2], matched[1]


  new Model


exports.$inject = ["$http"]