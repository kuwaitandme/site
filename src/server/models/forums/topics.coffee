###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Cache) ->
  class Model extends BaseModel
    tableName: "forums_topics"


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "controllers/cache"
]
