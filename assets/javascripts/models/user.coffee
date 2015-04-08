helpers = require 'app-helpers'
ajax = helpers.ajax

module.exports = Backbone.Model.extend
  idAttribute: "_id"
  name: "[model:user]"

  url: ->
    id = @get 'id'
    if id then "/api/user/#{id}" else "/api/user"


  defaults:
    adminReason: ''
    credits: 0
    description: ''
    email: ''
    isModerator: false
    language: 0
    lastLogin: [ ]
    loginStrategy: 0
    name: ''
    personal: { }
    status: 0
    username: ''

  loginStrategies:
    EMAIL:       0
    FACEBOOK:    1
    TWITTER:     2
    YAHOO:       3
    GOOGLEPLUS:  4
    PHONEGAP:    5

  initialize: ->
    console.log @name, 'initializing'
    @$body = $ 'body'
    @on 'sync', =>
      console.log @name, 'syncing'
      if not @isAnonymous()
        @$body.addClass 'loggedin'
        @$body.removeClass 'loggedout'
      else
        @$body.removeClass 'loggedin'
        @$body.addClass 'loggedout'
      console.log @name, 'synced'
      @trigger 'synced'


  login: (username, password, callback) ->
    console.debug @name, 'logging in user'

    $.ajax
      type: 'POST'
      url: "/api/auth/email/#{username}"
      beforeSend: ajax.setHeaders
      data:
        username: username
        password: password

      # This function gets called when the user successfully logs in
      success: (response) =>
        console.debug @name, 'user logged in', response

        # Save the data from the server
        @set response
        @trigger 'sync', response

        # Call the callback
        callback null, response

      # This function sends the error message to the callback
      error: (error) =>
        console.error @name, 'error logging in', error
        callback error


  signup: (parameters, callback) ->
    console.debug @name, 'signing up new user'

    $.ajax
      type: 'POST'
      url: "/api/auth/email/"
      beforeSend: ajax.setHeaders
      data: parameters

      # This function gets called when the user is created successfully
      success: (response) -> callback null, response

      # This function sends the error message to the callback
      error: (error) =>
        console.error @name, 'error creating user', error
        callback error


  # Logs the user out and signals listeners if any.
  logout: ->
    $.get "/api/auth/logout/"
    @clear()
    @trigger 'sync'


  # Returns true iff the user is anonymous
  isAnonymous: -> not @has "_id"