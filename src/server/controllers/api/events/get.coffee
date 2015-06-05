exports = module.exports = (Events) ->
  controller = (request, response, next) ->
    # Prints out the events in a CSV style format
    Events.query request.query
    .then (events) ->
      eventsJson = events.toJSON()
      output = ""
      for event in eventsJson
        for key of event
          if typeof event[key] is "object"
            event[key] = JSON.stringify event[key]
          output += "#{event[key]} "
        output += "\n"
      response.end output

exports["@require"] = ["models/events"]
exports["@singleton"] = true
