module.exports = ->
  date = new Date()
  date.setDate date.getDate() - 7

  Classified = global.models.classified
  Classified.model.find {'created': {'$lt': date }}, (error, classifieds) ->

    # For every classified that has to expire
    for classified in classifieds

      # Expire it!
      Classified.status.expire classified._id, (error, results) ->
        if error then console.log error

        # send expired email