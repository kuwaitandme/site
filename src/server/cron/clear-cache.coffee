exports = module.exports = (IoC, Cache) ->
  logger = IoC.create "igloo/logger"
  name = "[cron:clear-cache]"

  job = ->
    logger.info name, "running"
    Cache.del "route:api/categories/counters"


exports["@require"] = [
  "$container"
  "controllers/cache"
]
exports["@singleton"] = true
