ajax = (require 'app-helpers').ajax

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
    @fetch = (options) -> if not @cachedFetch options then @oldFetch options

    # The sync event is triggered by the fetch() function.
    @on 'sync', =>
      @setCache()
      @getCounters (error, results) =>
        console.log @name, 'synced'
        @trigger 'synced'


  # Save the model into HTML5 localstorage
  setCache: (value) ->
    console.log @name, 'caching category details'

    # localStorage = app.controllers.localStorage
    if not @resources.cache.get 'models:category'
      @resources.cache.cache 'models:category', JSON.stringify @toJSON()


  getChildren: (parentId) ->
    parent = @find id: parentId
    if parent then parent.get 'children'
    else []

  # A reroute of backbone's fetch which first checks in the browser's
  # localStorage for the collection before making a AJAX call.
  #
  # Instead of calling the fetch function, you are encouraged to use this
  # version of fetch.
  cachedFetch: (options={}) ->
    # Attempt to load from HTML5 localStorage
    cache = @resources.cache.get 'models:category'
    if cache
      console.log @name, 'setting categories from cache'
      json = JSON.parse cache
      @set json
      @trigger 'sync'
      return true

    # If nothing was cached then, return false so that the original fetch
    # function is called
    console.log @name, 'fetching from API'
    false

  getCounters: (callback=->) ->
    # Send the AJAX request
    $.ajax
      type: 'GET'
      url: '/api/category?count=true'
      dataType: 'json'
      beforeSend: ajax.setHeaders
      success: (response) =>
        console.log @name, 'fetching category counters'
        @setCounters response
        callback null, response

      error: (response) =>
        console.error @name, 'error fetching category counters', response
        callback response

  setCounters: (counters) ->
    categories = @toJSON()

    for category in categories
      for categoryCount in counters.category
        if categoryCount._id is category._id
          category.count = categoryCount.total
          break
        else
          category.count = 0

      for childCategory in category.children
        for categoryCount in counters.childCategory
          if categoryCount._id is childCategory._id
            childCategory.count = categoryCount.total
            break
          else
            childCategory.count = 0


    @reset categories