exports = module.exports = (Enum) ->
  class Languages extends Enum
    downloadUrl: -> "/api/language/en"
    name: "[model:language]"

    data: {}

    translate: (key, page) ->
      console.log 'translating', "#{page}:#{key}"
      @data["#{page}:#{key}"] or ""


  new Languages


exports.$inject = ["models.base.enum"]
