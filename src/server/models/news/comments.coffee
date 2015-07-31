Promise  = require "bluebird"
_        = require "underscore"
markdown = require("markdown").markdown

exports = module.exports = (BaseModel, Comments, Stories) ->
  class Model extends BaseModel
    tableName: "news_story_comments"

    create: (storyID, data) ->
      newComment =
        content_markdown: data.content
        content: markdown.toHTML data.content
        created_by: data.created_by
        slug: @createSlug()

      Comments.create newComment
      .then (comment) =>
        Stories.increaseCommentsCount storyID
        @model.forge(story: storyID, comment: comment.id).save()


    extends: hasTimestamps: false


  new Model


exports["@require"] = [
  "models/base/model"
  "models/comments"
  "models/news/stories"
]
exports["@singleton"] = true
