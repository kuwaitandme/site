###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Enum) ->
  class Model extends BaseModel
    tableName: "forum_topics"


  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  # "models/base/enum"
]
