classified = global.models.classified
config = global.config


controller = module.exports =

	get: (request, response, next) ->
		id = request.params.id

		if !/^[0-9A-F]*$/i.test(id) then return next()

		classified.get id, (classified) ->

			# Display 404 page if classified is not found
			if !classified then return next()

			render = global.helpers.render
			render request, response,
				bodyid: 'classified-finish'
				page: 'classified/finish'
				title: response.__('title.guest.finish')

				data:
					classified: classified
					_2checkout:
						sid: config._2checkout.sid
						publicKey: config._2checkout.publicKey
					sitekey: config.reCaptcha.site


	post: (request, response, next) ->
		id = request.params.id
		POSTdata = request.body

		if not request.body or request.body.length == 0 then return next()
		if not request.body.token then return next()
		if not /^[0-9A-F]*$/i.test(id) then return next()

		perks = request.body['perks[]']
		price = 0
		perks[0] = true
		perks[1] = false
		if perks[0] then price += 15
		if perks[1] then price += 45

		POSTdata =
			sellerId: config._2checkout.sid
			privateKey: config._2checkout.privateKey
			token: request.body.token
			currency: 'USD'
			total: price
			billingAddr:
				addrLine1: request.body['billingAddr[addrLine1]']
				addrLine2: request.body['billingAddr[addrLine2]']
				city: request.body['billingAddr[city]']
				country: request.body['billingAddr[country]']
				email: request.body['billingAddr[email]']
				name: request.body['billingAddr[name]']
				phoneNumber: request.body['billingAddr[phoneNumber]']
				state: request.body['billingAddr[state]']
				zipCode: request.body['billingAddr[zipCode]']

		twocheckout = global.helpers.twocheckout
		twocheckout.processTransaction id, POSTdata, (err, data, transaction) ->
			if err then return response.end(
				JSON.stringify
					data: data
					error: err
					transaction: transaction)

			# Success! Add perks to the classified
			if perks and perks[0] then classified.makeUrgent _id

			response.end JSON.stringify
				status: 'success'
				transaction: transaction