bCrypt    = require 'bcrypt-nodejs'
mongoose  = require 'mongoose'
validator = require 'validator'

users = module.exports =
  model: mongoose.model 'user',
    # Main info
    username: String
    password: String
    email: String
    name: String
    description: String
    profileLink: String
    thumb: String

    activationToken: String
    moderatorReason: String
    credits: Number
    isModerator: Boolean
    language: Number
    loginFailures: Number
    loginStrategy: Number
    resetToken: String
    created: Date
    status: Number # 0:Inactive,1:Active,2:Banned

    # Personal information
    personal: { }
      # address: String
      # gender: Number
      # location: Number
      # phone: String
      # website: String
      # email: String

  loginStrategies:
    EMAIL:       0
    FACEBOOK:    1
    TWITTER:     2
    YAHOO:       3
    GOOGLEPLUS:  4
    PHONEGAP:    5

  status:
    INACTIVE: 0
    ACTIVE:   1
    BANNED:   2
    SUSPEND: 3


  activate: (id, token="", callback) ->
    @model.findOne { _id: id }, (error, user) ->
      if error then callback error

      # Check if user exists
      if not user then return callback 'user does not exist'

      # Check the activation token
      if user.activationToken != token
        return callback 'invalid activation token'

      # If all went well, then activate the user
      user.activationToken = ''
      user.status = users.status.ACTIVE
      user.save (error) -> callback error, true


  createResetToken: (email, callback) ->
    @model.findOne { email: email }, (error, user) ->
      if error then callback error

      # Check if the user exists
      if not user then return callback 'user does not exist'

      # Check if the user is activated
      if user.status is not users.status.ACTIVE
        callback 'user is not activated'

      # Generate a reset token
      user.resetToken = randomHash()
      user.save (err) -> callback err, user


  resetPassword: (id, token, password, callback) ->
    @model.findOne { _id: id }, (err, user) ->
      if err then throw err

      # Check cast error

      # Check if user exists
      if not user
        return callback 'user does not exist'

      # Check if a password request was set or not
      if not user.resetToken
        return callback 'no reset token was set'

      # Check the reset token
      if user.resetToken is not token
        return callback 'invalid reset token'

      # Reset the user password and get rid of reset token
      user.password = createHash(password)
      user.resetToken = null
      user.save (error) -> callback error, true


  addCredits: (id, credits, callback=->) ->
    if not validator.isMongoId id then return callback "bad/empty id"
    if not validator.isInt credits then return callback "bad/empty credits"

    @model.findOne { _id: id }, (error, user) ->
      if error then return callback error
      if not user then return callback 'user does not exist'

      user.credits = user.credits or 0
      user.credits += credits
      user.save (error) -> callback error, true


  get: (id, callback) -> @model.findOne { _id: id }, callback


  auth:
    email:
      MAX_FAIL_ATTEMPTS: 50

      # Checks if the given username and password are valid or not.
      isValidPassword: (user, password) ->
        bCrypt.compareSync password, user.password


      validate: (user, password, callback) ->
        user.loginFailures = user.loginFailures or 0

        if user.loginFailures > @MAX_FAIL_ATTEMPTS
          user.status = users.status.SUSPEND
          user.moderatorReason = 'user suspended. too many failed attempts'
          user.save (error) -> callback error or user.moderatorReason

        else if not @isValidPassword user, password
          user.loginFailures++
          user.save (error) -> callback error or 'invalid password'

        else
          user.loginFailures = 0
          user.save (error) -> callback error, user

      create: (name, username, password, callback) ->
        parameters =
          loginStrategy: users.loginStrategies.EMAIL
          username: username
        users.model.findOne { username: username }, (error, user) ->
          if error then callback error
          if user and user.length > 0 then return callback 'user exists'

          # If there is no user with that email, create the user
          newUser = new users.model
          newUser.loginStrategy = users.loginStrategies.EMAIL
          newUser.created = Date.now()

          # set the user's local credentials
          newUser.name = name
          newUser.username = username
          newUser.email = username
          newUser.password = createHash password

          # Give defaults to other parameters
          newUser.isModerator = false
          newUser.language = 0
          newUser.status = users.status.INACTIVE
          newUser.activationToken = randomHash()

          # Start off the user with 10 credits
          newUser.credits = 10

          # Save and call the callback function
          newUser.save (error) -> callback error, newUser

    facebook:
      findOrCreate: (profile, callback) ->
        parameters =
          loginStrategy: users.loginStrategies.FACEBOOK
          username: profile.id

        users.model.findOne parameters, (error, user) ->
          if error then return callback error
          if user then return callback null, user

          # If there is no user with that email, create the user
          newUser = new users.model
          newUser.loginStrategy = users.loginStrategies.FACEBOOK
          newUser.created = Date.now()

          # set the user's local credentials
          newUser.name = profile.displayName
          newUser.username = profile.id
          newUser.profileLink = profile.profileUrl

          # Give defaults to other parameters
          newUser.isModerator = false
          newUser.language = 0
          newUser.status = users.status.ACTIVE

          # Start off the user with 10 credits
          newUser.credits = 10

          # Save and call the callback function
          newUser.save (error) -> callback error, newUser


    googlePlus:
      findOrCreate: (profile, callback) ->
        parameters =
          loginStrategy: users.loginStrategies.GOOGLEPLUS
          username: profile.id

        users.model.findOne parameters, (error, user) ->
          if error then return callback error
          if user then return callback null, user

          # If there is no user with that email, create the user
          newUser = new users.model
          newUser.loginStrategy = users.loginStrategies.GOOGLEPLUS
          newUser.created = Date.now()

          # set the user's local credentials
          newUser.name = profile.displayName
          newUser.username = profile.id

          photos = profile.photos or [{}]
          newUser.thumb = photos[0].value

          # Give defaults to other parameters
          newUser.isModerator = false
          newUser.language = 0
          newUser.status = users.status.ACTIVE

          # Start off the user with 10 credits
          newUser.credits = 10

          # Save and call the callback function
          newUser.save (error) -> callback error, newUser

    yahoo:
      findOrCreate: (profile, callback) ->
        parameters =
          loginStrategy: users.loginStrategies.YAHOO
          username: profile.id

        users.model.findOne parameters, (error, user) ->
          if error then return callback error
          if user then return callback null, user

          # If there is no user with that email, create the user
          newUser = new users.model
          newUser.loginStrategy = users.loginStrategies.YAHOO
          newUser.created = Date.now()

          # set the user's local credentials
          newUser.name = profile.displayName
          newUser.username = profile.id
          newUser.profileLink = profile.profileUrl

          # Give defaults to other parameters
          newUser.isModerator = false
          newUser.language = 0
          newUser.status = users.status.ACTIVE

          # Start off the user with 10 credits
          newUser.credits = 10

          # Save and call the callback function
          newUser.save (error) -> callback error, newUser

    twitter:
      findOrCreate: (profile, callback) ->
        parameters =
          loginStrategy: users.loginStrategies.TWITTER
          username: profile.id

        users.model.findOne parameters, (error, user) ->
          if error then return callback error
          if user then return callback null, user

          # If there is no user with that email, create the user
          newUser = new users.model
          newUser.loginStrategy = users.loginStrategies.TWITTER
          newUser.created = Date.now()

          # set the user's local credentials
          newUser.name = profile.displayName
          newUser.username = profile.username

          photos = profile.photos or [{}]
          newUser.thumb = photos[0].value

          # Give defaults to other parameters
          newUser.isModerator = false
          newUser.language = 0
          newUser.status = users.status.ACTIVE

          # Start off the user with 10 credits
          newUser.credits = 10

          # Save and call the callback function
          newUser.save (error) -> callback error, newUser


# Creates a salted hash from the given password.
createHash = (password) -> bCrypt.hashSync password, bCrypt.genSaltSync(10), null

# Helper function to create a random hash
randomHash = ->
  s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
  s4() + s4() + s4() + s4() + s4() + s4()