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
    @on 'sync', ->
      @setCache()
      console.log @name, 'synced'
      @trigger 'synced'


  # Save the model into HTML5 localstorage
  setCache: () ->
    console.log @name, 'caching location details'

    if not @resources.cache.get 'models:locations'
      @resources.cache.set 'models:locations', JSON.stringify @toJSON()


  # A reroute of backbone's fetch which first checks in the browser's
  # localstorage for the collection before making a AJAX call
  cachedFetch: (options={}) ->
    # Attempt to load from HTML5 localStorage
    cache = @resources.cache.get 'models:locations'
    if cache
      console.log @name, 'setting locations from cache'
      json = JSON.parse cache
      @set json
      @trigger 'sync'
      return true

    # If nothing was cached then, signal to fetch from the API
    console.log @name, 'fetching from API'
    false