exports = module.exports = (Cache, renderer, Categories, Classifieds) ->
  controller = (request, response, next) ->
    page = 1
    title = ""
    reverse = false
    parameters = {}

    parentCategory = request.params[0]
    childCategory = request.params[1]

    cache =
      # Give a 30 minute lifespan
      timeout: 60 * 30
      # Set the key according to the parent and child categories...
      key: "route:/classified/#{parentCategory}/#{childCategory}"

    # Alright, so first check in the cache..
    Cache.get cache.key
    .catch ->
      # Ok, so nothing was found in the cache. This means that we will have to
      # start querying for the cache AND for the classifieds
      Categories.getAll()
      .then (categories) ->
        # 404 because there must be a parent_category
        if not parentCategory then throw new Error "no parent category"

        # Iterate on the parent category based on the first slug
        for parent in categories
          # If a parent category has been found
          if parent.slug == parentCategory
            parameters.parent_category = parent.id
            title = parent.name

            # Iterate on the child category based on the second slug
            if childCategory?
              for child in parent.children
                # If a child category has been found
                if child.slug == childCategory
                  parameters.child_category = child.id
                  title = "#{child.name} - #{parent.name}"
                  break

              # 404 because child_category exists but does not match any
              # valid category
              if not parameters.child_category
                throw new Error "bad child category"
            break

        # 404 because parent_category did not match any valid category
        if not parameters.parent_category
          throw new Error "bad parent category"

        # Allow only active classifieds to be listed
        parameters.status = Classifieds.statuses.ACTIVE

        # Once the parameters have been filtered out, we send it to the DB for
        # querying..
        parameters

      # Now query the DB!
      .then Classifieds.query

      # Now using the parameters of the previous promise, we call our model to
      # query on the DB
      #
      # Set the Now save the classifieds in the cache (while giving a timeout)
      .then (classifieds) ->
        json = classifieds.toJSON()
        Cache.set cache.key, json, cache.timeout
        json

    # Finally, now that we have a bunch of classifieds we can send it to the
    # renderer and return the output
    .then (classifieds) ->
      options =
        cache: cache
        data: classifieds: classifieds
        page: "classified/search"
        title: title
      renderer request, response, options

    # On any error, simply return a 404
    .catch -> next()


exports["@require"] = [
  "libraries/cache"
  # "models/categories"
  # "models/sharing/items"
]
exports["@singleton"] = true