exports = module.exports = ($http) ->
  class Model
    name: "[model:classified]"

    query: (page=1) -> $http.post "/api/query?page=#{page}"


    save: (classified={}) ->
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
      window.a = formdata
      console.log formdata
      $http
        url: url
        data: formdata
        method: method
        transformRequest: angular.identity
        headers: "Content-Type": undefined
      .success (response) -> console.log response


    search: (parameters, callback) ->
      $http.get "/api/classified"
      .success (classifieds) -> callback null, classifieds
      .error callback


    get: (id, callback) ->
      $http.get "/api/classified/#{id}"
      .success (classified) -> callback null, classified
      .error callback

    getBySlug: (slug, callback) ->
      $http.get "/api/classified/slug/#{slug}"
      .success (classified) -> callback null, classified
      .error callback

    getDefault: ->
      contact:       {}
      filesToDelete: []
      images:        []
      meta:          {}
      perks:         {}
      reports:       []


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
      formdata.append "classified", JSON.stringify data
      for image in images then if image.status is "to-upload"
        formdata.append "images[]", image.file
      formdata



  new Model


exports.$inject = ["$http"]