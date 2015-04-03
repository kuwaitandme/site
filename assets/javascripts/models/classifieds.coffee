# This file contains a Backbone.Collection.. blah blah

ajax = (require 'app-helpers').ajax

module.exports = Backbone.Collection.extend
  consoleSlug: '[model:classifieds]'

  model: require './classified'
  isAccount: false

  fetch: (parameters = {}) ->
    # Generate the URL to send the request to
    if not @isAccount then baseUrl = '/api/query?'
    else baseUrl = '/api/account/manage?'
    url = App.Resources.Config.host + baseUrl + $.param(parameters)

    # Send the AJAX request
    $.ajax
      type: 'POST'
      url: url
      dataType: 'json'
      # data: parameters
      beforeSend: ajax.setHeaders
      success: (response) =>
        console.debug @consoleSlug, 'fetching classifieds', response
        newModels = []

        # For each classified convert it into a Backbone.Model and
        # push it into a temporary array
        for classified in response
          model = new @model classified
          model.trigger 'parse'
          newModels.push model

        # Add the classifieds into our collection
        @add newModels

        # Signal any listeners that we are done loading the
        # classifieds
        @trigger 'ajax:done', newModels

      error: (response) =>
        console.error @consoleSlug, 'error fetching classifieds', response