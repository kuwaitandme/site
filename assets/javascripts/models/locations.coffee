model = Backbone.Model.extend
  idAttribute: "_id"
  defaults:
    _id: null
    name: ''


module.exports = Backbone.Collection.extend
  model: model
  name: '[model:locations]'
  url: "/api/location"


  initialize: (@config) ->
    console.log @name, 'initializing'

    # Redirect fetch to our cached version of fetch
    @oldFetch = @fetch
    @fetch = (options) -> if not @cachedFetch options then @oldFetch options

    # The sync event is triggerd by the fetch() function.
    @on 'sync', @setCache


  # Save the model into HTML5 localstorage
  setCache: (value) ->
    console.log @name, 'caching location details'

    # localStorage = window.app.controllers.localStorage
    @resources.cache.cache 'mod:locations', JSON.stringify value


  # A reroute of backbone's fetch which first checks in the browser's
  # localstorage for the collection before making a AJAX call
  cachedFetch: (options={}) ->
    # Attempt to load from HTML5 localStorage
    cache = @resources.cache.get 'mod:locations'
    if cache
      console.log @name, 'setting locations from cache'
      json = JSON.parse cache
      @set json
      if options.success then options.success json
      return true

    # If nothing was cached then, signal to fetch from the API
    console.log @name, 'fetching from API'
    false