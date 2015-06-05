exports = module.exports = (Events) ->
  controller = (request, response, next) ->
    # Prints out the events in a CSV style format
    Events.query request.query
    .then (events) ->
      eventsJson = events.toJSON()
      output = ""
      for event in eventsJson
        output += "#{event.id} #{event.ip}\t#{event.timestamp}"
        output += "\t#{event.user or -1} #{JSON.stringify event.data or {}}"
        output += "\n"
      response.end output

exports["@require"] = ["models/events"]
exports["@singleton"] = true
