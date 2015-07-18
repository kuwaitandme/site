###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"
validator = require "validator"

exports = module.exports = (BaseModel, Enum) ->
  # after this many minutes old, a story cannot be edited
  MAX_EDIT_MINS = 90

  # days a story is considered recent, for resubmitting
  RECENT_DAYS = 30


  class Model extends BaseModel
    tableName: "news_stories"


    initialize: ->
      (new Enum "news_categories").then (json) => @categories = json
      @top = @query
      @model = @model.extend


    ###
     ## Custom validation hook
    ###
    validationURL: (json) ->
      if json.url?
        if not validator.isURL json.url then throw new Error "URL is invalid"
      else if json.description?
        if json.description.strip().length == 0
          throw new Error "must contain description if no URL posted"
      else throw new Error "must contain either description or URL"


    isRecent: (json) -> json.created_at >= RECENT_DAYS.days.ago #fix this

  new Model


exports["@singleton"] = true
exports["@require"] = [
  "models/base/model"
  "models/base/enum"
]
