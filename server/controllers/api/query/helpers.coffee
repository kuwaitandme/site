validator = require 'validator'

module.exports =
  getQueryParameters: (request) ->
    classified = global.models.classified
    parameters = {}
    parameters.status = classified.status.ACTIVE

    # Set the category
    if validator.isMongoId request.query.category
      parameters.category = request.query.category

    # Set price min and max
    price = {}
    priceMax = request.query.priceMax
    priceMin = request.query.priceMin
    if validator.isFloat priceMin
      price.$gte = Number priceMin
      priceSet = true
    if validator.isFloat priceMax
      price.$lte = Number priceMax
      priceSet = true
    if priceSet then parameters.price = price

    # Set the classified type
    if validator.isInt request.query.type
      type = Number request.query.type
      if type in ['0', '1'] then parameters.type = type

    # Set the keywords
    if request.query.keywords
      keywords = request.query.keywords.split ' '
      regex = []

      for keyword in keywords
        if validator.isAlphanumeric keyword
          regex.push (new RegExp keyword, 'i')

      parameters.$and = [{
        $or: [
          { title: $all: regex }
          { description: $all: regex }
        ]
      }]

    parameters