Model = module.exports = (Bookshelf) ->
  Bookshelf.Model.extend
    tableName: "locations"
    cache: true


Model["@require"] = ["models/base/bookshelf"]
Model["@singleton"] = true