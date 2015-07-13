###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise   = require "bluebird"
bCrypt    = require "bcrypt-nodejs"
validator = require "validator"
TABLENAME = "users"


loginStrategies =
  EMAIL: 0
  FACEBOOK: 1
  TWITTER: 2
  YAHOO: 3
  GOOGLEPLUS: 4
  PHONEGAP: 5

roles =
  NORMAL: 0
  MODERATOR: 1
  ADMIN: 2

statuses =
  INACTIVE: 0
  ACTIVE: 1
  BANNED: 2
  SUSPENDED: 3


###*
 * Helper function to create a random password
 *
 * @return String          A random password with a format that follows
 *                         XXXX-XXXX-XXXX
###
randomPassword = ->
  s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
  "#{s4()}-#{s4()}-#{s4()}"


exports = module.exports = (IoC, knex, cache) ->
  logger = IoC.create "igloo/logger"
  name = "[model:users]"

  bookshelf   = (require "bookshelf") knex
  model      = bookshelf.Model.extend tableName: TABLENAME
  collection = bookshelf.Collection.extend model: model

  usersPerPage = 20

  class Users
    ###*
     * Queries all the users that matches the given parameters.
     *
     * @param  Object  parameters      An object containing query parameters
     * @return Promise                 Promise that resolves to an array of
     *                                 users that match the conditions in the
     *                                 query.
    ###
    query: (parameters={}) ->
      buildQuery = (qb) ->
        # Helper function to check if the number is a valid int
        validInt = (i) -> i? and validator.isInt i, min: 0

        status = parameters.status
        if validInt status then qb.where "status", status

        page = parameters.page
        if not validInt page then page = 1

        qb.limit usersPerPage
        qb.offset (page - 1) * usersPerPage
        qb.orderBy "created", "DESC"

      model.query(buildQuery).fetchAll()
      # collection.forge parameters
      # .query()


    ###*
     * Queries all the users and finds the first matching user that matches the
     * values in the parameters
     *
     * @param  {[type]} parameters={} [description]
     * @return {[type]}                 [description]
    ###
    findOne: (parameters={}) -> model.forge(parameters).fetch()


    ###*
     * Fetches a user, but unlike findOne this takes in only an id.
     *
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
    ###
    get: (id) -> model.forge(id: id).fetch()


    # Creates a new user
    create: (parameters={}) ->
      parameters.credits = 100
      model.forge(parameters).save()


    ###*
     * Creates a user with the given email, with a temporary password
     *
     * @param  {[type]} email       [description]
     * @param  {[type]} newPassword [description]
     * @return {[type]}             [description]
    ###
    createTemporary: (email, newPassword) ->
      Model.findOne(email: email).then (user) =>
        if user then throw new Error "email conflict"

        newUser =
          email: email
          full_name: "Anonymous"
          login_providers: email: email
          password: Model.hashPassword newPassword
          meta: hasTemporaryPassword: true
          status: statuses.ACTIVE
        Model.create newUser

    ###*
     * [patch description]
     * @param  {[type]} id         [description]
     * @param  {[type]} parameters [description]
     * @return {[type]}            [description]
    ###
    patch: (id, parameters) -> model.forge(id: id).save parameters




    ###*
     * Predicate functions for the different enum roles fields.
     *
     * @param  bookshelf.Model user     The user to verify against
     * @return Boolean
    ###
    isAdmin: (user) -> roles.ADMIN is user.get 'role'
    isModerator: (user) -> roles.MODERATOR is user.get 'role'


    ###*
     * Predicate functions for the different enum status fields.
     *
     * @param  bookshelf.Model user     The user to verify against
     * @return Boolean
    ###
    isActive: (user) -> user.status is @statuses.ACTIVE
    isBanned: (user) -> user.status is @statuses.BANNED
    isInactive: (user) -> user.status is @statuses.INACTIVE
    isSuspended: (user) -> user.status is @statuses.SUSPENDED


    ###*
     * Validates the two given password using bcrypt.
     *
     * @param  String  password1      The plaintext password
     * @param  String  password2      The hashed version of the password
     * @return Boolean                True iff the hashed version of the
     *                                plaintext and the given hash match.
    ###
    isPasswordValid: (password1, password2) ->
      try return bCrypt.compareSync password1, password2
      catch e then return false


    ###*
     * Function to generate a strong salted hash using the given password.
     *
     * @param  String password     The password to hash.
     * @return String              The hashed password.
    ###
    hashPassword: (password) ->
      bCrypt.hashSync password, (bCrypt.genSaltSync 10), null


    ###*
     * A function used to serailize the user.
     *
     * This function follows a node-style callback layout because it is intended
     * to be used with passport's passport.serialize().
     *
     * @param  bookshelf.Model user  The model of the user to serialize.
     * @param  Function callback     The callback function that returns the
     *                               serialize version of the user.
    ###
    serialize: (user={}, callback) -> callback null, user.id


    ###*
     * A function used to deserailize the user.
     *
     * This function follows a node-style callback layout because it is intended
     * to be used with passport's passport.deserialize().
     *
     * @param  Number id            The id of the user to query for.
     * @param  Function callback    The callback function that returns the
     *                              desired user.
    ###
    deserialize: (id, callback) ->
      Users.get(id).then (user) -> callback null, user
      .catch (error) -> callback error.message


  new Users


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/knex"
  "controllers/cache"
]
