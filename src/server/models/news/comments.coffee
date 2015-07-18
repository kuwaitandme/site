###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Enum) ->
  class Model extends BaseModel
    tableName: "news_stories"

    initialize: ->
      # (new Enum "forum_topic_statuses").then (json) => @statuses = json
      @top = @query

  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "models/base/enum"
]
