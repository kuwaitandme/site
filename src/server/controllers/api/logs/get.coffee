util = require "util"
zpad = require "zpad"

exports = module.exports = (Logs) ->
  controller = (request, response, next) ->

    # Prints out the events in a CSV style format
    Logs.query(request.query).then (events) ->
      output = ""
      for event in events
        timestamp = event.created_at

        date = util.format "%s:%s:%s %s/%s/%s",
          (zpad timestamp.getHours()),
          (zpad timestamp.getMinutes()),
          (zpad timestamp.getSeconds()),
          (zpad timestamp.getDate()),
          (zpad timestamp.getMonth()),
          (zpad timestamp.getFullYear())

        eventString = util.format "%s [ip:%s] %s [user:%s] [type:%s] %s\n",
          (zpad event.id, 4),
          (zpad event.ip, 16, " "),
          date,
          (zpad event.user or 1, 4, " "),
          (zpad event.type, 2, " "),
          (JSON.stringify event.data or {})
        output += eventString
      response.end output

    .catch next

exports["@require"] = ["models/logs"]
exports["@singleton"] = true
