exports = module.exports = (Category) ->
  (categoryId, type, key="name") ->
    switch type
      when "parent" then category = Category.findByParentId categoryId
      when "child" then category = Category.findByChildId categoryId
    category ?= {}
    category[key]

exports.$inject = ["models.categories"]
