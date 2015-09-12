Model = module.exports = (BaseModel) ->
  new class extends BaseModel
    tableName: "messages"
    extends: created_by: -> @belongsTo "users", "created_by"


Model["@require"] = ["models/base/model"]
Model["@singleton"] = true