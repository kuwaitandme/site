module.exports = (app) ->
  console.log "initializing models"

  app.factory "@models/base/enum",           require "./base/enum"
  app.factory "@models/languages",           require "./languages"
  app.factory "@models/sharing/categories",  require "./sharing/categories"
  app.factory "@models/sharing/comments",    require "./sharing/comments"
  app.factory "@models/sharing/stories",     require "./sharing/categories"
  app.factory "@models/users",               require "./users"