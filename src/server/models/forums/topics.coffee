###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Enum) ->
  class Model extends BaseModel
    tableName: "forum_topics"

    # Enable validation
    validate: true

    # Setup the enum types
    enums:
      statuses: tableName: "forum_topic_statuses"


    getLatestByCategory: (categoryID, page=1) ->
      buildQuery = (qb) -> qb.where "category", categoryID
      @query buildQuery, {page: page, category: categoryID}

  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "models/base/enum"
]
