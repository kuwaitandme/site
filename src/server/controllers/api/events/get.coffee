util = require "util"
zpad = require "zpad"

exports = module.exports = (Events) ->
  controller = (request, response, next) ->

    # Prints out the events in a CSV style format
    Events.query(request.query).then (events) ->
      eventsJSON = events.toJSON()
      output = ""
      for event in eventsJSON
        timestamp = event.timestamp

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

exports["@require"] = ["models/events"]
exports["@singleton"] = true
