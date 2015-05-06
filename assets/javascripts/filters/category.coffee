exports = module.exports = (Category) ->
  (categoryId) ->
    category = Category.findById categoryId
    category.name

exports.$inject = ["model.category"]