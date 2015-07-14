
_ = require "underscore"
bookshelf = require "bookshelf"
# config = require('../../config')
# errors = require('../../errors')
# filters = require('../../filters')
moment = require('moment')
Promise = require('bluebird')
sanitizer = require('validator').sanitize
schema = require('../../data/schema')
utils = require('../../utils')
uuid = require('node-uuid')
validation = require('../../data/validation')
baseUtils = require('./utils')
pagination = require('./pagination')
ghostBookshelf = undefined
# ### ghostBookshelf
# Initializes a new Bookshelf instance called ghostBookshelf, for reference elsewhere in Ghost.
ghostBookshelf = bookshelf(config.database.knex)
# Load the Bookshelf registry plugin, which helps us avoid circular dependencies
ghostBookshelf.plugin 'registry'
# Load the Ghost pagination plugin, which gives us the `fetchPage` method on Models
ghostBookshelf.plugin pagination
# ## ghostBookshelf.Model
# The Base Model which other Ghost objects will inherit from,
# including some convenience functions as static properties on the model.
ghostBookshelf.Model = ghostBookshelf.Model.extend({
  hasTimestamps: true
  permittedAttributes: ->
    _.keys schema.tables[@tableName]
  defaults: ->
    { uuid: uuid.v4() }
  initialize: ->
    self = this
    options = arguments[1] or {}
    # make options include available for toJSON()
    if options.include
      @include = _.clone(options.include)
    @on 'creating', @creating, this
    @on 'saving', (model, attributes, options) ->
      Promise.resolve(self.saving(model, attributes, options)).then ->
        self.validate model, attributes, options
    return
  validate: ->
    validation.validateSchema @tableName, @toJSON()
  creating: (newObj, attr, options) ->
    if !@get('created_by')
      @set 'created_by', @contextUser(options)
    return
  saving: (newObj, attr, options) ->
    # Remove any properties which don't belong on the model
    @attributes = @pick(@permittedAttributes())
    # Store the previous attributes so we can tell what was updated later
    @_updatedAttributes = newObj.previousAttributes()
    @set 'updated_by', @contextUser(options)
    return
  fixDates: (attrs) ->
    self = this
    _.each attrs, (value, key) ->
      if value != null and schema.tables[self.tableName].hasOwnProperty(key) and schema.tables[self.tableName][key].type == 'dateTime'
        # convert dateTime value into a native javascript Date object
        attrs[key] = moment(value).toDate()
      return
    attrs
  fixBools: (attrs) ->
    self = this
    _.each attrs, (value, key) ->
      if schema.tables[self.tableName].hasOwnProperty(key) and schema.tables[self.tableName][key].type == 'bool'
        attrs[key] = if value then true else false
      return
    attrs
  contextUser: (options) ->
    # Default to context user
    if options.context and options.context.user
      return options.context.user
      # Other wise use the internal override
    else if options.context and options.context.internal
      return 1
    else
      errors.logAndThrowError new Error('missing context')
    return
  format: (attrs) ->
    @fixDates attrs
  parse: (attrs) ->
    @fixBools @fixDates(attrs)
  toJSON: (options) ->
    attrs = _.extend({}, @attributes)
    self = this
    options = options or {}
    options = _.pick(options, [
      'shallow'
      'baseKey'
      'include'
      'context'
    ])
    if options and options.shallow
      return attrs
    if options and options.include
      @include = _.union(@include, options.include)
    _.each @relations, (relation, key) ->
      if key.substring(0, 7) != '_pivot_'
        # if include is set, expand to full object
        fullKey = if _.isEmpty(options.baseKey) then key else options.baseKey + '.' + key
        if _.contains(self.include, fullKey)
          attrs[key] = relation.toJSON(_.extend({}, options,
            baseKey: fullKey
            include: self.include))
      return
    attrs
  sanitize: (attr) ->
    sanitizer(@get(attr)).xss()
  updatedAttributes: ->
    @_updatedAttributes or {}
  updated: (attr) ->
    @updatedAttributes()[attr]

},
  permittedOptions: ->
    # terms to whitelist for all methods.
    [
      'context'
      'include'
      'transacting'
    ]
  filterData: (data) ->
    permittedAttributes = @::permittedAttributes()
    filteredData = _.pick(data, permittedAttributes)
    filteredData
  filterOptions: (options, methodName) ->
    permittedOptions = @permittedOptions(methodName)
    filteredOptions = _.pick(options, permittedOptions)
    filteredOptions
  findAll: (options) ->
    options = @filterOptions(options, 'findAll')
    @forge().fetchAll(options).then (result) ->
      if options.include
        _.each result.models, (item) ->
          item.include = options.include
          return
      result
  findPage: (options) ->
    options = options or {}
    self = this
    itemCollection = @forge()
    tableName = _.result(@prototype, 'tableName')
    filterObjects = self.setupFilters(options)
    # Filter options so that only permitted ones remain
    options = @filterOptions(options, 'findPage')
    # Extend the model defaults
    options = _.defaults(options, @findPageDefaultOptions())
    # Run specific conversion of model query options to where options
    options = @processOptions(itemCollection, options)
    # Prefetch filter objects
    Promise.all(baseUtils.filtering.preFetch(filterObjects)).then(->
      # If there are `where` conditionals specified, add those to the query.
      if options.where
        itemCollection.query 'where', options.where
      # Setup filter joins / queries
      baseUtils.filtering.query filterObjects, itemCollection
      # Handle related objects
      # TODO: this should just be done for all methods @ the API level
      options.withRelated = _.union(options.withRelated, options.include)
      options.order = self.orderDefaultOptions()
      itemCollection.fetchPage(options).then (response) ->
        data = {}
        data[tableName] = response.collection.toJSON(options)
        data.meta = pagination: response.pagination
        baseUtils.filtering.formatResponse filterObjects, options, data
    ).catch errors.logAndThrowError
  findOne: (data, options) ->
    data = @filterData(data)
    options = @filterOptions(options, 'findOne')
    # We pass include to forge so that toJSON has access
    @forge(data, include: options.include).fetch options
  edit: (data, options) ->
    id = options.id
    data = @filterData(data)
    options = @filterOptions(options, 'edit')
    @forge(id: id).fetch(options).then (object) ->
      if object
        return object.save(data, options)
      return
  add: (data, options) ->
    data = @filterData(data)
    options = @filterOptions(options, 'add')
    model = @forge(data)
    # We allow you to disable timestamps when importing posts so that the new posts `updated_at` value is the same
    # as the import json blob. More details refer to https://github.com/TryGhost/Ghost/issues/1696
    if options.importing
      model.hasTimestamps = false
    model.save null, options
  destroy: (options) ->
    id = options.id
    options = @filterOptions(options, 'destroy')
    # Fetch the object before destroying it, so that the changed data is available to events
    @forge(id: id).fetch(options).then (obj) ->
      obj.destroy options
  generateSlug: (Model, base, options) ->
    slug = undefined
    slugTryCount = 1
    baseName = Model::tableName.replace(/s$/, '')
    checkIfSlugExists = undefined
    longSlug = undefined

    checkIfSlugExists = (slugToFind) ->
      args = slug: slugToFind
      # status is needed for posts
      if options and options.status
        args.status = options.status
      Model.findOne(args, options).then (found) ->
        trimSpace = undefined
        if !found
          return slugToFind
        slugTryCount += 1
        # If we shortened, go back to the full version and try again
        if slugTryCount == 2 and longSlug
          slugToFind = longSlug
          longSlug = null
          slugTryCount = 1
          return checkIfSlugExists(slugToFind)
        # If this is the first time through, add the hyphen
        if slugTryCount == 2
          slugToFind += '-'
        else
          # Otherwise, trim the number off the end
          trimSpace = -String(slugTryCount - 1).length
          slugToFind = slugToFind.slice(0, trimSpace)
        slugToFind += slugTryCount
        checkIfSlugExists slugToFind

    slug = utils.safeString(base)
    # If it's a user, let's try to cut it down (unless this is a human request)
    if baseName == 'user' and options and options.shortSlug and slugTryCount == 1 and slug != 'ghost-owner'
      longSlug = slug
      slug = if slug.indexOf('-') > -1 then slug.substr(0, slug.indexOf('-')) else slug
    # Check the filtered slug doesn't match any of the reserved keywords
    filters.doFilter('slug.reservedSlugs', config.slugs.reserved).then((slugList) ->
      # Some keywords cannot be changed
      slugList = _.union(slugList, config.slugs.protected)
      if _.contains(slugList, slug) then slug + '-' + baseName else slug
    ).then (slug) ->
      # if slug is empty after trimming use the model name
      if !slug
        slug = baseName
      # Test for duplicate slugs.
      checkIfSlugExists slug
)

# Export ghostBookshelf for use elsewhere
module.exports = ghostBookshelf
