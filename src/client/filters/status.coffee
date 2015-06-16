exports = module.exports = (Classifieds) ->
  (status, type) ->
    switch type
      when "classified"
        switch status
          when Classifieds.statuses.ACTIVE   then return "Active"
          when Classifieds.statuses.ARCHIVED then return "Archived"
          when Classifieds.statuses.BANNED then return "Banned"
          when Classifieds.statuses.EXPIRED then return "Expired"
          when Classifieds.statuses.FLAGGED then return "Flagged"
          when Classifieds.statuses.INACTIVE then return "Inactive"
          when Classifieds.statuses.REJECTED then return "Rejected"
          when Classifieds.statuses.VERIFIED then return "Verified"
    #     category = Category.findByParentId categoryId
    #   when "child" then category = Category.findByChildId categoryId
    # category.name

exports.$inject = [
  "models.classifieds"
]
