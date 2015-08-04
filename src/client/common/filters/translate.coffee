exports = module.exports = (Languages) -> (key, page) ->
  Languages.translate key, page
exports.$inject = ["models.languages"]
