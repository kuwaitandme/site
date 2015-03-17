validator = require 'validator'


# This function is responsible for patching specific fields of the user,
# namely the 'status', 'perks' or the 'reports'. This should be the only
# function that is able to modify these fields.
#
# The function rejects requests for various reasons and returns error codes
# with 400, 401 or 404. Any OS related errors get passed to the next(..).
#
# This function also takes care of all the possible senarios, each of which has
# been written in the comments below.
module.exports = (request, response, next) ->
	data = request.body
	id = request.params.id
	user = request.user or {}
	isModerator = request.user and user.isModerator or false

	response.contentType 'application/json'

	# First check for any invalid parameters.
	if not id
		response.status 404
		return response.end '"need id"'
	if not validator.isMongoId id
		response.status 400
		return response.end '"invalid id"'

	# Check if the parameters that we accepts are there or not
	if not data.status? and not data.perks? and not data.reports?
		response.status 400
		return response.end '"patch only specific parameters"'

	# For each parameter, validate it before continuing
	if data.status  and not isValidStatus data.status, data.adminReason
		response.status 400
		return response.end '"invalid status/reason"'
	if data.perks and not isValidPerk data.perks
		response.status 400
		return response.end '"invalid perks"'
	if data.reports and not isValidReport data.reports
		response.status 400
		return response.end '"invalid report"'

	# If all the parameters are valid, then get the classified and start
	# validating against the user
	classifiedModel = global.models.classified
	classifiedModel.get id, (error, classified) ->
		# Check if the classified first of all, exists.
		if not classified
			response.status 404
			return response.end '"not found"'

		# This condition determines if the currently loggedin in user is the
		# owner of the classified or not
		isOwner = (String user._id) is (String classified.owner)

		# Check conditions for a guest classified
		if classified.guest
			# The authentication hash must match to modify this classified or
			# you must be a moderator.
			if classified.authHash != request.query.authHash and
				not isModerator
					console.log 'hit'
					response.status 401
					return response.end '"unauthorized"'

		# Check conditions for regular classified
		else
			# You must be the owner/moderator if you are modifying a regular
			# classified.
			if user and not isModerator and not isOwner
				console.log 'hit2'
				response.status 401
				return response.end '"unauthorized"'

		# All the data coming in has been validated properly, so now call the
		# specific function to update the respective field.
		if data.status?       then updateStatus  classified, request, response, next
		else if data.perks?   then updatePerks   classified, request, response, next
		else if data.reports? then updateReports classified, request, response, next

		# Theoretically, you shouldn't reach this condition because of all
		# checks above, but no harm in having it here.
		else
			response.status 412
			return response.end '"patch only specific parameters"'



updateReports = (classified, request, response, next) ->

updatePerks = (classified, request, response, next) ->

updateStatus = (classified, request, response, next) ->
	newStatus = request.body.status
	adminReason = request.body.adminReason

	user = request.user or {}
	isModerator = user.isModerator
	isOwner = (user._id is classified.owner)

	classifiedModel = global.models.classified
	status = classifiedModel.status
	id = classified._id

	# Check now if the status is valid
	if not validator.isFloat newStatus
	# if not validator.isInteger newStatus
		response.status 400
		return response.end '"invalid status"'

	# Check if the user has the privileges to change to the given status
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

	# The callback function that gets called after the status of the classified
	# has been changed.
	callback = (error, result) ->
		if error
			if error.status
				response.status error.status
				return response.end JSON.stringify error.message
			else next error

		response.end JSON.stringify result

	# Finally, switch on the status and perform the necessary action.
	switch newStatus
		when status.ACTIVE
			if isModerator then status.publish id, callback
			else status.repost id, callback
		when status.ARCHIVED then status.archive id, callback
		when status.BANNED then status.ban id, adminReason, callback
		when status.INACTIVE then status.inactive id, callback
		when status.REJECTED then  status.reject id, adminReason, callback

		# The last condition, again, you should not reach here because of all
		# the previous checks
		else
			error = new Error "invalid status/reason"
			error.status = 400
			callback error, null


# This function attempts to validate the classified status and returns true
# iff the fields are valid.
isValidStatus = (status, adminReason) ->
	classifiedModel = global.models.classified
	statuses = classifiedModel.status

	if status? and validator.isFloat status and
	Number status in [statuses.ACTIVE, statuses.ARCHIVED, statuses.BANNED,
		statuses.INACTIVE, statuses.REJECTED]
		return true
	false

# TODO implement this soon
isValidReport = -> true
isValidPerk = -> true

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
	# 			bodyid: 'classified-callback'
	# 			page: 'classified/callback'
	# 			title: response.__('title.guest.callback')

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
