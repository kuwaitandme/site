module.exports = class Model

  defaults: {}

  constructor: (data) -> @set data

  # These get and set methods properly set/get the classified taking care of
  # any missing data.
  get: -> @data
  set: (data) -> @data = angular.extend {}, @defaults, data
