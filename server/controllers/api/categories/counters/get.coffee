async = require "async"

exports = module.exports = (Classifieds, cache) ->
  controller = (request, response, next) ->
    # Async tasks to fetch both the parent and child category's counters
    # from the DB
    asyncTasks =
      child_category:  (finish) -> Classifieds.getChildCategoryCount finish
      parent_category: (finish) -> Classifieds.getParentCategoryCount finish

    # Async finish function. Take the counters, save them in the cache and
    # return.
    asyncFinish = (error, counters) ->
      json = JSON.stringify counters, null, 2
      cache.set "route:api/categories/counters", json
      response.json counters

    # Now check in cache if the counters exist. If they don't then perform the
    # async call to fetch them from the DB.
    cache.get "route:api/categories/counters", (error, results) =>
      if error or results
        response.contentType "application/json"
        response.end results
      else async.parallel asyncTasks, asyncFinish


exports["@singleton"] = true
exports["@require"] = [
  "models/classifieds"
  "controllers/cache"
]