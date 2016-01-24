Promise   = require "bluebird"
bCrypt    = require "bcrypt-nodejs"
validator = require "validator"


Model = module.exports = (Bookshelf) ->
  Bookshelf.Model.extend
    tableName: "users"
    cache: true
    require: true
    resultsPerPage: 20
    hidden: ["password", "rss_token", "mailing_list_token"]

    enums:
      roles: tableName: "user_roles", pick: "name"
      statuses: tableName: "user_statuses", pick: "name"


    ###
      Each user can publish many sharable items
    ###
    topics: -> @hasMany "sharing_items"


    ###
      Predicate functions for the different enum status fields. Returns True iff
      the user's status matches any of the functions.
    ###
    isActive: -> @statuses.ACTIVE is @get "status"
    isBanned: -> @statuses.BANNED is @get "status"
    isInactive: -> @statuses.INACTIVE is @get "status"
    isSuspended: -> @statuses.SUSPENDED is @get "status"


    ###
      Predicate functions for the different enum roles fields. Returns True iff
      the user's roles matches with the function's name.
    ###
    isAdmin: (user) -> @roles.ADMIN is user.get 'role'
    isModerator: (user) -> @roles.MODERATOR is user.get 'role'


    ###
      Validates the given password using bcrypt. Returns True iff the hashed
      version of the plaintext password matches this user's hash.
    ###
    checkPassword: (p) -> bCrypt.compareSync p, @get "password"


    ###
      Function to generate a strong salted hash using the given password.
    ###
    hashPassword: (p) -> bCrypt.hashSync p, (bCrypt.genSaltSync 10), null
  ,
    ###
      A static function used to serailize the user.

      This function follows a node-style callback layout because it is intended
      to be used with passport's passport.serialize().
    ###
    serialize: (user={}, callback) -> callback null, user.id

    ###
      A static function used to deserailize the user.

      This function follows a node-style callback layout because it is intended
      to be used with passport's passport.deserialize().
    ###
    deserialize: (id, callback) ->
      @forge(id: id).fetch().then (user) -> callback null, user
      .catch (error) -> callback error.message


Model["@require"] = ["models/base/bookshelf"]
Model["@singleton"] = true