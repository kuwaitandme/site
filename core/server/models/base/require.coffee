_   = require "lodash"


Plugin = module.exports = (bookshelf) ->
  fetch = bookshelf.Model.prototype.fetch
  fetchAll = bookshelf.Model.prototype.fetchAll

  _.extend bookshelf.Model.prototype,
    require: false

    fetch: (options={}) ->
      options.require ?= @require
      fetch.apply this, [options]

    fetchAll: (options={}) ->
      options.require ?= @require
      fetchAll.apply this, options