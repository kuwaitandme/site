Model = ($root, Enum) ->
  class Languages extends Enum
    data: {}
    tag: Model.tag
    md5Key: "locale:en"

    downloadUrl: -> "/api/language/en"


    translate: (text, page) ->
      key = "#{page}:#{text}"
      @data[key] or ""


    onChange: -> $root.$emit "model:language:change"


  new Languages


Model.tag = "model:language"
Model.$inject = [
  "$rootScope"
  "@models/base/enum"
]
module.exports = Model