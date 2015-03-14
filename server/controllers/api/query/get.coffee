getQueryParameters = (request) ->
	parameters = {}
	parameters.status = 1

	# Set the category
	if request.query.category and (/^[0-9A-F]*$/i.test request.query.category)
		parameters.category = request.query.category

	# Set price min and max
	price = {}
	priceMax = request.query.priceMax
	priceMin = request.query.priceMin
	if priceMin and (/^[-0-9]*$/.test priceMin)
		price.$gte = Number priceMin
	if priceMax and (/^[-0-9]*$/.test priceMax)
		price.$lte = Number priceMax
	if (Object.keys price).length > 0 then parameters.price = price

	# Set the classified type
	type = Number request.query.type
	if type and (type == 1 or type == 0) then parameters.type = type

	# Set the keywords
	if request.query.keywords
		keywords = request.query.keywords.split ' '
		regex = []

		for keyword in keywords
			if /^[0-9A-Z]*$/i.test keyword
				regex.push (new RegExp keyword, 'i')

		parameters.$and = [{
			$or: [
				{ title: $all: regex }
				{ description: $all: regex }
			]
		}]

	parameters


module.exports = (request, response, next) ->
	response.contentType 'application/json'
	parameters = getQueryParameters request

	page = request.query.page or 1

	finish = (classifieds) -> response.end JSON.stringify(classifieds)

	classified = global.models.classified
	classified.search parameters, finish, page