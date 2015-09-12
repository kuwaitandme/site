Promise   = require "bluebird"
bCrypt    = require "bcrypt-nodejs"
validator = require "validator"


exports = module.exports = (BaseModel) ->

  class Comments extends BaseModel
    tableName: "comments"

    extends: created_by: -> @belongsTo "users", "created_by"


  new Comments


exports["@require"] = ["models/base/model"]
exports["@singleton"] = true
