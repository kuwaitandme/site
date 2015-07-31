exports = module.exports = (BaseModel) ->
  class Model extends BaseModel
    tableName: "news_categories"
    full_cache: true

  new Model


exports["@singleton"] = true
exports["@require"] = ["models/base/model"]
