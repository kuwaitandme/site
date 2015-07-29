elasticsearch = require "elasticsearch"


exports = module.exports = (IoC, settings) ->
  name = "[elasticsearch]"
  logger = IoC.create "igloo/logger"
  logger.verbose name, "connecting to elastic server"

  # Setup the options
  options = settings.elasticsearch
  options = host: "localhost:9200"
  if settings.server.env == "development" then options.log = "trace"

  # Initialize the client
  client = new elasticsearch.Client options



exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
