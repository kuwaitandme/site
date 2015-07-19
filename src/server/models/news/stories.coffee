###*
 * [Promise description]
 *
 * @author Steven Enamakel <me@steven.pw>
###
Promise = require "bluebird"
validator = require "validator"

exports = module.exports = (BaseModel, Enum, Users) ->
  # after this many minutes old, a story cannot be edited
  MAX_EDIT_MINS = 90

  # days a story is considered recent, for resubmitting
  RECENT_DAYS = 30


  class Model extends BaseModel
    tableName: "news_stories"


    constructor: ->
      super()

      (new Enum "news_categories").then (json) => @categories = json
      @top = @query

      # @model = @model.extend
      #   _created_by: -> @belongsTo Users.model
      # @model.get
      # @model.on "saving", @validationURL


    calculate_hotness: ->
      base = 0
      # self.tags.select{|t| t.hotness_mod != 0 }.each do |t|
      #   base += t.hotness_mod
      # end

      # Give a story's comment votes some weight, but ignore the story
      # submitter's own comments
      # cpoints = self.comments.where("user_id <> ?", self.user_id).
      #   select(:upvotes, :downvotes).map{|c| c.upvotes + 1 - c.downvotes }.
      #   inject(&:+).to_i
      cpoints = 0

      # don't immediately kill stories at 0 by bumping up score by one
      order = Math.log Math.max(Math.abs(score + 1).abs + cpoints, 1), 10
      if score > 0 then sign = 1
      else if score < 0 then sign = -1
      else sign = 0

      # TODO: as the site grows, shrink this down to 12 or so.
      window = 60 * 60 * 36

      Math.round -((order * sign) + base +
         (Number(@created_at or Date.now()) / window)), 7


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
  "models/users"
]
