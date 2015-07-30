###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel, Enum) ->
  class Model extends BaseModel
    tableName: "news_story_comments"

    getByStory: (storyID, page=1) ->
      buildQuery = (qb) -> qb.where "story", storyID
      @query buildQuery, page: page#, withRelated: ["created_by"]


    extends:
      comment: -> @belongsTo "comments", "comment"
      # created_by: -> @belongsTo "users", "created_by"
      # updated_by: -> @belongsTo "users", "updated_by"


  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "models/base/enum"
]
