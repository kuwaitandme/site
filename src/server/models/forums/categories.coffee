Promise = require "bluebird"


exports = module.exports = (BaseModel, Enum) ->
  class Model extends BaseModel
    tableName: "forum_categories"

    initialize: ->
      (new Enum "forum_category_statuses").then (json) => @statuses = json


  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "models/base/enum"
]
