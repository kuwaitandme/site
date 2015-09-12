module.exports = Model = (BaseModel) ->
  new class LocationModel extends BaseModel
    tableName: "sharing_categories"
    enableMD5: true
    fullCache: true


Model["@singleton"] = true
Model["@require"] = ["models/base/model"]