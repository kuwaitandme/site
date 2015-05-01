exports = module.exports = (category) ->
  (categoryId) ->
    cat = category.findById categoryId
    cat.name

exports.$inject = ["model.category"]