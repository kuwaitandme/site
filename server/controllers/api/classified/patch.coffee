validator = require 'validator'

module.exports = (request, response, next) ->
	data = request.body
	id = request.params.id

	user = request.user or {}
	isModerator = request.user and user.isModerator or false

	response.contentType 'application/json'

	if not id
		response.status 404
		return response.end '"need id"'

	if not validator.isMongoId id
		response.status 400
		return response.end '"invalid id"'

	if not data.status? and not data.perks? and not data.reports?
		response.status 400
		return response.end '"patch only specific parameters"'

	classifiedModel = global.models.classified
	classifiedModel.get id, (error, classified) ->
		if not classified
			response.status 404
			return response.end '"not found"'

		isOwner = (String user._id) is (String classified.owner)

		# Check conditions for guest classified
		if classified.guest
			if classified.authHash != request.query.authHash and
				not isModerator
					response.status 401
					return response.end '"unauthorized"'
			else guestBypass = true

		# Check conditions for regular classified
		if not guestBypass and not classified.guest and
		user and not isModerator and not isOwner
			response.status 401
			return response.end '"unauthorized"'

		# Update the status
		if data.status? then updateStatus classified, request, response, next
		# else if data.perks then updatePerks classified, request, response, next
		# else if data.reports then updateReports classified, request, response, next
		else
			response.status 412
			return response.end '"patch only specific parameters"'


updateStatus = (classified, request, response, next) ->
	newStatus = request.body.status
	adminReason = request.body.adminReason

	user = request.user or {}
	isModerator = user.isModerator
	isOwner = (user._id is classified.owner)

	classifiedModel = global.models.classified
	status = classifiedModel.status
	id = classified._id

	if not isModerator
		if classified.guest
			if newStatus in [status.ACTIVE, status.REJECTED, status.BANNED]
				response.status 401
				return response.end '"only a moderator can set that status"'
		else
			if newStatus in [status.REJECTED, status.BANNED, status.INACTIVE]
				response.status 401
				return response.end '"only a moderator can set that status"'
	else
		if newStatus is status.ARCHIVED
			response.status 401
			return response.end '"moderators should not archive a classified"'

	finish = (error, result) ->
		console.log 'error:', error, result

		if error
			if error.status is 401
				response.status 401
				return response.end JSON.stringify error.message
			else next error

		response.end JSON.stringify result

	switch newStatus
		when status.ACTIVE
			if isModerator then status.publish id, finish
			else status.repost id, finish
		when status.ARCHIVED then status.archive id, finish
		when status.BANNED then status.ban id, adminReason, finish
		when status.INACTIVE then status.inactive id, finish
		when status.REJECTED then  status.reject id, adminReason, finish



	# console.log classified.status, newStatus

	# performAdmin: (request, editable, superEditable, callback) ->
	# 	id = request.params.id
	# 	reason = request.body.reason

	# 	switch request.body.action

	# 		# These actions can only be performed by the classified owner
	# 		when 'archive'
	# 			classified.status.archive id
	# 			callback('success', 'archived')

	# 		when 'publish'
	# 			classified.status.publish id
	# 			callback('success', 'published')

	# 		# The actions below can only be performed by an admin
	# 		when 'ban'
	# 			if request.user.isAdmin
	# 				classified.status.ban id, reason or ''
	# 				callback('success', 'banned')
	# 			else callback('error', 'unpriv')

	# 		when 'reject'
	# 			if request.user.isAdmin
	# 				classified.status.reject id, reason or ''
	# 				callback('success', 'rejected')
	# 			else callback('error', 'unpriv')

	# 		when 'repost'
	# 			if request.user.isAdmin
	# 				classified.status.repost id
	# 				callback('success', 'reposted')
	# 			else callback('error', 'unpriv')


	# 		render = global.helpers.render
	# 		render request, response,
	# 			bodyid: 'classified-finish'
	# 			page: 'classified/finish'
	# 			title: response.__('title.guest.finish')

	# 			data:
	# 				classified: classified
	# 				_2checkout:
	# 					sid: config._2checkout.sid
	# 					publicKey: config._2checkout.publicKey
	# 				sitekey: config.reCaptcha.site


	# post: (request, response, next) ->
	# 	id = request.params.id
	# 	POSTdata = request.body

	# 	if not request.body or request.body.length == 0 then return next()
	# 	if not request.body.token then return next()
	# 	if not /^[0-9A-F]*$/i.test(id) then return next()

	# 	perks = request.body['perks[]']
	# 	price = 0
	# 	perks[0] = true
	# 	perks[1] = false
	# 	if perks[0] then price += 15
	# 	if perks[1] then price += 45

	# 	POSTdata =
	# 		sellerId: config._2checkout.sid
	# 		privateKey: config._2checkout.privateKey
	# 		token: request.body.token
	# 		currency: 'USD'
	# 		total: price
	# 		billingAddr:
	# 			addrLine1: request.body['billingAddr[addrLine1]']
	# 			addrLine2: request.body['billingAddr[addrLine2]']
	# 			city: request.body['billingAddr[city]']
	# 			country: request.body['billingAddr[country]']
	# 			email: request.body['billingAddr[email]']
	# 			name: request.body['billingAddr[name]']
	# 			phoneNumber: request.body['billingAddr[phoneNumber]']
	# 			state: request.body['billingAddr[state]']
	# 			zipCode: request.body['billingAddr[zipCode]']

	# 	twocheckout = global.helpers.twocheckout
	# 	twocheckout.processTransaction id, POSTdata, (err, data, transaction) ->
	# 		if err then return response.end(
	# 			JSON.stringify
	# 				data: data
	# 				error: err
	# 				transaction: transaction)

	# 		# Success! Add perks to the classified
	# 		if perks and perks[0] then classified.makeUrgent _id

	# 		response.end JSON.stringify
	# 			status: 'success'
	# 			transaction: transaction