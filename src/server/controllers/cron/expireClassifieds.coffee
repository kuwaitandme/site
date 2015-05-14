module.exports = ->
  expiredate = new Date()
  expiredate.setDate expiredate.getDate() - 30

  Classified = global.models.classified
  Classified.model.find { created: $lt: expiredate }, (error, classifieds) ->

    # For every classified that has to expire
    for classified in classifieds

      # Expire it!
      Classified.status.expire classified._id, (error, results) ->
        if error then console.log error

        # TODO: send expired email