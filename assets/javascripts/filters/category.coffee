exports = module.exports = (Category) ->
  (categoryId, type) ->
    switch type
      when "parent" then category = Category.findByParentId categoryId
      when "child" then category = Category.findByChildId categoryId
    category.name

exports.$inject = ["model.categories"]