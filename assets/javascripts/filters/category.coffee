exports = module.exports = (Category) ->
  (categoryId, type) ->
    console.log 'asd', type
    switch type
      when "parent" then category = Category.findByParentId categoryId
      when "child" then category = Category.findByChildId categoryId
    category.name

exports.$inject = ["model.category"]