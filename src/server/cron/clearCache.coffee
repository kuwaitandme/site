exports = module.exports = (IoC, cache) ->
  logger = IoC.create "igloo/logger"

  job = ->
    logger.info "clearing category counters"
    cache.del "route:api/categories/counters"


exports["@require"] = [
  "$container"
  "controllers/cache"
]
exports["@singleton"] = true