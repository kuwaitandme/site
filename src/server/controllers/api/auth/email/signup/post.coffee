passport = require "passport"
validator = require "validator"

# Controller for the Registering a user via email
exports = module.exports = (IoC, Email, reCaptcha, Users) ->
  logger = IoC.create "igloo/logger"

  validateRequest = (request) ->
    email = request.body.email
    fullname = request.body.fullname
    password = request.body.password
    repassword = request.body.repassword
    # Check for any missing fields
    if not fullname or not repassword or not password or not email
      throw new Error "missing fields"
    # Check for password mis-match
    if password is not repassword
      throw new Error "password mismatch"
    # Check for invalid characters
    if not (validator.isEmail email) or
    not (validator.matches fullname, /[a-zA-Z\s]*/)
      throw new Error "bad email/name"
    request


  createNewUserObject = (request) ->
    email: request.body.email
    full_name: request.body.fullname
    login_providers: email: request.body.email
    meta: activationToken: Users.randomPassword()
    password: Users.hashPassword request.body.password
    status: Users.statuses.INACTIVE


  validateWithDBUser = (newUser, dbUser) ->
    # User already exists in database.
    if dbUser
      dbUserJSON = dbUser.toJSON()
      if dbUserJSON.login_providers?
        # User exists and already has been registered with email login.
        if dbUserJSON.login_providers.email
          throw new Error "user already registered with email"
        else dbUserJSON.login_providers.email = newUser.email
        # User exists but does not have email login, so modify the current
        # user. Then save into the DB.
        dbUserJSON.meta ?= {}
        dbUserJSON.meta.newName = newUser.fullname
        dbUserJSON.meta.newPassword = newUser.password
        dbUserJSON.meta.signupVerifyToken = newUser.meta.activationToken
        emailOptions =
          template: "user-modified"
          subject: "Your account has been modified. Verify this!"
          user: dbUser
        [emailOptions, Users.patchPromise dbUserJSON.id, dbUserJSON]
    # If there is no user with that email, create the user
    else
      emailOptions =
        email: newUser.email
        template: "user-signup-activate"
        subject: "#{newUser.full_name}! Activate your account"
        user: newUser
      [emailOptions, Users.createPromise newUser]


  sendEmail = (emailOptions, newUser) ->
    emailOptions.user = newUser.toJSON()
    Email.sendTemplate emailOptions.email, emailOptions.template, emailOptions
    newUser


  (request, response, next) ->
    reCaptcha.verify request
    .then validateRequest
    .then createNewUserObject
    .then (newUser) -> [newUser, Users.findOnePromise email: newUser.email]
    .spread validateWithDBUser
    .spread sendEmail
    # Once done, return the fields that have been changed back to the user
    .then (result) -> response.json result.toJSON()
    .catch (error) ->
      logger.error    error.stack
      response.status error.status or 400
      response.json   error.message


exports["@require"] = [
  "$container"
  "controllers/email"
  "controllers/recaptcha"

  "models/users"
]
exports["@singleton"] = true