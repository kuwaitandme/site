###
Base Model Schema
====================

This class is responsible for making sure that our JSON objects always follow
the schema properly. It also allows us to perform XSS checks, json validation
and set any default values.
###
_                 = require "underscore"
jsonValidator     = require("jsonschema").Validator
traverse          = require "traverse"
validator         = require "validator"
xss               = require "xss"


###
 # Validator Plugin
 Extends `bookshelf.Model` with `validate` and `clean` functions

 @param {Bookshelf} bookshelf \- the instance to plug into
###
module.exports =  class Schema
  ###
    ## The main schema
    This object represents the schema of the model. You should override this
    with your own schema. Keywords and properties are set following
    [jsonschema's rules](https://www.npmjs.com/package/jsonschema#complex-example-with-split-schemas-and-references)
  ###
  schema:
    id: "/main"
    type: "object"


  ###
    ## Constructor
    This function is used to initialize the validator. It is only called once
    and makes sure that the schema is correctly instantiated.
  ###
  constructor: ->
    # Initialize the validator and attach our different schemas..
    @_jsonValidator = new jsonValidator


  ###
    ## Custom Schema
    This function allows you to customize your schema. This is particularly
    useful if you schema is deep (ie has more than one level of inheritance),

    @param {jsonschema.Validator} schema \-     The schema object with which we
                                                will attach the different
                                                schemas too.
    @return {jsonschema.Validator} \-           The new custom modified schema.
  ###
  customSchema: (schema) -> schema


  ###
    ## Validate JSON
    This function is used to validate the given JSON object with our schema.

    @param {JSON} json \- The JSON object to be validated.
    @throws {Exception} e \- Throws an exception if any of the type values has
                             failed validation.
  ###
  validateSchema: (json) ->
    # Validate first based on the schema
    results = @_jsonValidator.validate json, @schema

    # Now if there is an error, then throw the first one we find.
    if not results.valid and results.errors
      error = results.errors[0]
      error.message = "#{error.property} #{error.message}"
      throw results.errors[0]


  ###
    ## Clean JSON
    Clean the json by performing XSS and key filters on it and also
    apply any default values in case we expect any DB insertion errors.

    @param JSON json \- The classified object that is to be cleaned
    @return JSON \- The result after cleaning the object
  ###
  clean: (json) ->
    # First pick out only the necessary fields, removing unwanted ones
    filteredJSON = @filter json

    # Traverse through each key
    traverse filteredJSON
    .forEach (value) ->
      # If it is not defined then remove it.. (remove any annoying nulls..)
      if not value? then @remove()

      # If it is a string then perform an XSS filter on it
      else if typeof value is "string" then value = xss value

    # Apply the default values.
    finalJSON = {}
    _.extend finalJSON, @defaults, filteredJSON

    # Return the cleaned object
    finalJSON


  ###
    ## Filters JSON
    This function performs a filter on the given object and removes any unwanted
    fields as per the schema.

    @param {Object} json      A JSON of the classified
    @return {Object}          A filtered object of the classified that has all
                              unwanted fields removed out.
  ###
  filter: (json) ->
    json = _.pick json, (v, key, o) => key in @mainFields

    # Because Underscore refuses to perform a deep pick/extend, we will have to
    # manually filter out all the sub-json fields..
    if json.images then for image in json.images or []
      image = _.pick image, (v, key, o) => key in @imageFields
    if json.meta
      json.meta = _.pick json.meta, (v, key, o) => key in @metaFields
    if json.contact
      json.contact = _.pick json.contact, (v, key, o) => key in @contactFields

    # This json has now been properly filtered. Return it.
    json