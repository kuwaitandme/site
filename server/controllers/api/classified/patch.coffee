validator = require 'validator'

module.exports = (request, response, next) ->
	data = request.body
	console.log request.body, request.user

	response.contentType 'application/json'

	id = request.params.id
	if not validator.isMongoId id
		response.status 400
		return response.end "invalid id"

	if not data.status and not data.perks and not data.reports
		response.status 412
		return response.end "patch only specific parameters"

	classifiedModel = global.models.classified
	classifiedModel.get id, (classified) ->

		if not classified
			response.status 404
			return response.end "not found"

		user = request.user or {}
		isAdmin = user.isAdmin

		# Check conditions for guest classified
		if classified.guest and
		classified.authHash != request.query.authHash and
		not isAdmin
			response.status 401
			return response.end "unauthorized"
		else guestBypass = true

		# Check conditions for regular classified
		if not guestBypass and
		not classified.guest and
		not request.isAuthenticated() and
		not isAdmin and
		not user._id == classified.owner
			response.status 401
			return response.end "unauthorized"

		# Update the status
		if data.status then updateStatus classified, request, response, next
		# else if data.perks then updatePerks classified, request, response, next
		# else if data.reports then updateReports classified, request, response, next
		else
			response.status 412
			return response.end "patch only specific parameters"

		# Update the perks
		# if request.body.perks
		# 	doPerks

		# 	return response.redirect "/api/guest/#{id}"

updateStatus = (classified, request, response, next) ->

	newStatus = request.body.status
	adminReason = request.body.adminReason

	if classified.status is newStatus
		return response.end JSON.stringify classified

	classifiedModel = global.models.classified
	isModerator = request.user.isAdmin
	isOwner = (request.user._id is classified.owner)

	if classified.guest and
	not isModerator and
	newStatus in [classifiedModel.ACTIVE, classifiedModel.REJECTED, classifiedModel.BANNED]
		response.status 401
		return response.end "only a moderator can set that status"

	if not isModerator and
	newStatus in [classifiedModel.REJECTED, classifiedModel.BANNED]
		response.status 401
		return response.end "only a moderator can set that status"

	status = classifiedModel.status
	switch newStatus
		when classifiedModel.ACTIVE
			if isModerator then status.publish classified._id, finish
			else status.repost classified._id, finish

		when classifiedModel.REJECTED
			status.reject classified._id, adminReason, finish

		when classifiedModel.ARCHIVED
			status.archive classified._id, finish

		when classifiedModel.BANNED
			status.ban classified._id, adminReason, finish

		when classifiedModel.INACTIVE
			status.inactive classified._id, finish


	finish = (error, result) ->
		if error
			if error.status is 401
				response.status 401
				return response.end error.message
			else next error

		response.end result

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