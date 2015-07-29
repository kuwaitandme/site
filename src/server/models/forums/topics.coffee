###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"


exports = module.exports = (BaseModel) ->
  class Model extends BaseModel
    tableName: "forum_topics"

    # Enable validation
    validate: true

    # Setup the enum types
    enums: statuses: tableName: "forum_topic_statuses"


    getLatestByCategory: (categoryID, page=1) ->
      buildQuery = (qb) -> qb.where "category", categoryID
      @query buildQuery, page: page, withRelated: ["created_by"]


    getCreator: (id) ->
      @model.where(id: id).fetch
      withRelated: [ created_by: (qb) -> qb.column "username", "email", "name" ]
      .then (model) -> model.related "created_by"


    extends:
      created_by: -> @belongsTo "users", "created_by"

      updated_by: -> @belongsTo "users", "updated_by"


  new Model


exports["@singleton"] = true
exports["@require"] = ["models/base/model"]
