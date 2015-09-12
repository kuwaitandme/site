exports = module.exports = (BaseModel) ->
  class Model extends BaseModel
    tableName: "sharing_item_statuses"
    full_cache: true

  new Model


exports["@singleton"] = true
exports["@require"] = ["models/base/model"]