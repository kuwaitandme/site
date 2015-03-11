classified = global.models.classified


# Controller for the classified search page. Searches for classifieds with
# some search parameters passed on as GET variables.
controller = module.exports =

	get: (request, response, next) ->
		parameters = controller.getQueryParameters(request)
		classified.search parameters, ((classifieds) ->
			render = globals.helpers.render
			render request, response,
				bodyid: 'classified-search'
				page: 'classified/search'
				title: response.__('title.classified.search')

				data: classifieds: classifieds
		), 1


	post: (request, response, next) ->
		response.contentType 'application/json'
		parameters = controller.getQueryParameters request

		if request.query.page then page = request.query.page
		else page = 1

		finish = (classifieds) -> response.end JSON.stringify(classifieds)

		classified.search parameters, finish, page


	getQueryParameters: (request) ->
		parameters = {}
		parameters.status = 1

		# Set the category
		if request.query.category and /^[0-9A-F]*$/i.test(request.query.category)
			parameters.category = request.query.category

		# Set price min and max
		price = {}
		priceMax = request.query.priceMax
		priceMin = request.query.priceMin
		if priceMin and /^[-0-9]*$/.test(priceMin)
			price.$gte = Number(priceMin)
		if priceMax and /^[-0-9]*$/.test(priceMax)
			price.$lte = Number(priceMax)
		if Object.keys(price).length > 0 then parameters.price = price

		# Set the classified type
		type = Number(request.query.type)
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