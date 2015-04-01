# This file contains a Backbone.Collection representing a list of categories
# for the site. Ideally the collection is instantiated only once, because the
# list of categories is immutable.

model = Backbone.Model.extend
  idAttribute: "_id"
  defaults:
    _id: null
    count: 0
    name: ''


module.exports = Backbone.Collection.extend
  model: model
  name: '[model:categories]'
  url: "/api/category"


  initialize: (@config) ->
    console.log @name, 'initializing'

    # Redirect fetch to our cached version of fetch
    @oldFetch = @fetch
    @fetch = (arg) -> if not @cachedFetch arg then @oldFetch arg

    # The sync event is triggered by the fetch() function.
    @on 'sync', @setCache


  # Save the model into HTML5 localstorage
  setCache: (value) ->
    console.log @name, 'caching category details'

    # localStorage = app.controllers.localStorage
    @resources.cache.cache 'mod:category', JSON.stringify value


  # A reroute of backbone's fetch which first checks in the browser's
  # localStorage for the collection before making a AJAX call.
  #
  # Instead of calling the fetch function, you are encouraged to use this
  # version of fetch.
  cachedFetch: ->
    # Attempt to load from HTML5 localStorage
    # localStorage = window.app.controllers.localStorage
    cache = @resources.cache.get 'mod:category'
    if cache
      console.log @name, 'setting categories from cache'
      json = JSON.parse cache
      @set json
      return true

    # If nothing was cached then, return false so that the original fetch
    # function is called
    console.log @name, 'fetching from API'
    false