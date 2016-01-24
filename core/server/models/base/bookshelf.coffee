###
BaseModel
=========

This file describes the baseModel for all the other models that will get used
in the side. This Model builds on top of `Bookshelf.Model` and provides easy
to use functions as well convience ones.
###
Bookshelf           = require "bookshelf"
BookshelfValidator  = require "bookshelf-validator"
Md5                 = require "MD5"
Promise             = require "bluebird"
_                   = require "underscore"
moment              = require "moment"
randomstring        = require "randomstring"
slug                = require "slug"
traverse            = require "traverse"
traverse            = require "traverse"
validator           = require "validator"
xss                 = require "xss"


module.exports = BaseModel = (knex, Cache, NotFoundError, Settings) ->
  bookshelf = Bookshelf knex

  # Load the Bookshelf registry plugin, which helps us avoid circular
  # dependencies.
  bookshelf.plugin "registry"

  # Load validation plugin for any schema related changes.
  bookshelf.plugin BookshelfValidator.plugin

  # Load a custom caching plugin, to allow small tables to be cached in memory.
  bookshelf.plugin require("./cache") Cache

  # Load a custom caching plugin, to allow small tables to be cached in memory.
  bookshelf.plugin require "./enum"

    # Load a custom caching plugin, to allow small tables to be cached in memory.
  bookshelf.plugin require("./custom_errors") NotFoundError

  # Load the app's pagination plugin, which gives us the `fetchPage` method on
  # Models.
  bookshelf.plugin require "./pagination"

  # Load require plugin, which forces the 'require' property on queries
  bookshelf.plugin require "./require"

  # Allow setting of hidden fields when serializing toJSON
  bookshelf.plugin "visibility"

  # Extend the Bookshelf Model
  bookshelf.Model = bookshelf.Model.extend
    hasTimestamps: true

    ###
    **createSlug()** This is a helper function used to generate a unique slug
    from a price of given text. Useful for creating URL slugs.

    ```
    Model.createSlug('hello world') # -> 'hello-world-asdqw12asd'
    ```
    ###
    createSlug: (t="") -> slug "#{t} #{randomstring.generate 10}".toLowerCase()


    ###
    **clean()** Cleans the model by performing XSS and removing unwanted
    keys.

    ```
    Model.model.clean()
    ```
    ###
    clean: ->
      for key of @attributes
        # First remove any unwanted fields
        if key not in @fields then return @unset key

        # JSON stringify any JSON fields.
        if key in @jsonFields
          @attributes[key] = JSON.stringify @attributes[key]

      # Traverse through each key
      traverse @attributes
      .forEach (value, key) ->
        # If it is not defined then remove it.. (remove any annoying nulls)
        if not value? then @remove()

        # If it is a string then perform an XSS filter on it
        else if typeof value is "string" then value = xss value

      # Return this instance to allow chaining.
      this


  # Override the NotFoundError to our custom 404 error.
  console.log 's',bookshelf.Model.NotFoundError

  # Return the customized bookshelf instance
  bookshelf


BaseModel["@require"] = [
  "igloo/knex"
  "libraries/cache"
  "libraries/errors/NotFoundError"
  "igloo/settings"
]
BaseModel["@singleton"] = true