async     = require 'async'
mongoose  = require 'mongoose'
util      = require 'util'
validator = require 'validator'

Schema    = mongoose.Schema
ObjectId  = Schema.ObjectId

classifieds = module.exports =
	model: mongoose.model 'classified',
		category:          ObjectId
		created:           Date
		description:       String
		images:          [ String ]
		price:             Number
		status:            Number # 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned
		title:             String
		type:              Number # 0:Sale,1:Want
		views:             Number
		location:          ObjectId

		moderatorReason:   String
		authHash:          String
		guest:             Boolean
		owner:             ObjectId

		reports:         [  ]
		perks:           [  ]
		contact:         [  ]
		meta:            [  ]


	classifiedPerPage: 15
	reportsPerPostBeforeFlag: 3


	# This function creates the classified object and saves it into the DB. The
	# classified will be validated and filtered for bad fields before getting
	# saved into the DB.
	create: (data, user, callback) ->
		isEmpty = (string) -> not string or string.length == 0

		# Validate each field one by one
		if isEmpty data then message = "empty fields"
		if isEmpty data.description then return message = "empty description"
		if isEmpty data.title then return message = "empty title"
		if isEmpty data.type then return message = "empty type"
		if isEmpty data.category or not validator.isMongoId data.category
			return message = "bad/empty category"
		if isEmpty data.price or not validator.isFloat data.price
			return message = "bad/empty price"
		if isEmpty data.location and not validator.isMongoId data.location
			return message = "bad/empty location"

		# If there was an error. Don't create the classified and pass the error
		# back to the callback
		if message
			error = new Error message
			error.status = 400
			return callback error

		classified = new @model

		# Start saving the fields one by one
		classified.category         = data.category
		classified.contact          = data.contact
		classified.description      = data.description
		classified.images           = data.images
		classified.location         = data.location
		classified.meta             = data.meta
		classified.price            = data.price
		classified.saleby           = data.saleby
		classified.title            = data.title
		classified.type             = data.type

		# Set up some defaults
		classified.created = Date.now()
		classified.perks.promote = false
		classified.perks.urgent = false
		classified.views = 0

		# Create a random hash which will be used by guest classifieds
		classified.authHash = randomHash()

		# If you are logged in, then we will make you the owner of this
		# classified; Otherwise we will label this classified as a guest
		# classified.
		#
		# Also guest classifieds automatically get the status of INACTIVE
		# whereas normal classifieds get the status of ACTIVE. This forces a
		# moderator to review a guest classified.
		if user? and user._id
			classified.owner = user._id
			classified.guest = false
			classified.status = @status.ACTIVE
		else
			classified.status = @status.INACTIVE
			classified.guest = true

		# Commit to the database and call the callback function
		classified.save (error) -> callback error, classified


	# Gets a single classified, given it's id.
	get: (id, callback) ->
		if not validator.isMongoId id
			error = new Error "bad/empty id"
			error.status = 400
			return callback error

		@model.findOne { _id: id }, (error, result) ->
			if error then callback error
			else callback error, result


	# Finds all the classifieds with the given parameters. This is abit of a
	# dangerous function in that it does not have any restriction/validation
	# on the search parameters. This function should later be replaced by an
	# optimized search-engine.
	#
	# 'page' controls which page the query is in; to avoid loading all classifieds
	# at once. The classified per page is calculate by the value saved in
	# 'classifiedPerPage'.
	#
	# 'reverse' is a Boolean which decides if the query results should be
	# reversed or not. The results are sorted by date and hence will show latest
	# classified in the front iff reverse if false
	search: (parameters, page, reverse, callback) ->
		if not page then page = 1
		if reverse then sort = 1 else sort = -1

		classifiedsToSkip = if page > 0 then (page - 1) * @classifiedPerPage else 0

		# Prepare a query which searchs with the given parameter and offsets
		# and limits with the 'classifieds per page' and 'page index' parameters
		query = @model.find parameters, authHash: 0
			.sort created: sort
			.skip classifiedsToSkip
			.limit @classifiedPerPage

		query.exec (err, result) -> callback err, result


	# Labels a classified as an urgent classified
	makeUrgent: (id, callback) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then callback err
			if classified
				classified.perks.urgent = true
				classified.save (err) -> callback err, classified


	# Promotes a classified
	promote: (id, callback) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then callback err
			if classified
				classified.perks.promote = true
				classified.save (err) -> callback err, classified


	# Increments the view counter of the classified
	incrementViewCounter: (id, callback) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then callback err
			if classified
				if not classified.views then classified.views = 1
				else classified.views += 1
				classified.save (err) -> callback err, classified


	# Add a report to the classified with the given reason. If the user is
	# spamming this classified then the report gets rejected. If the classified
	# has too many reports then it gets flagged for a moderator to be review.
	report: (id, reason, ip, callback) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then callback err
			if not classified then return callback null, null

			# Check if the same ip is flagging the classified or not, to avoid
			# spam
			for report in classified.reports
				if report.ip is ip then return callback null, null

			# If it was a valid report, add it to the list of reports
			classified.reports.push
				ip: ip
				reason: reason

			# Check if this classified has reached it's limit for it to be
			# reviewed by a moderator
			if classified.reports.length > @reportsPerPostBeforeFlag
				classified.status = @status.FLAGGED

			# Commit to the database
			classified.save (err) -> callback err, classified


	# The functions below perform actions on only the status of the classified
	status:
		INACTIVE: 0
		ACTIVE: 1
		REJECTED: 2
		ARCHIVED: 3
		BANNED: 4
		FLAGGED: 5
		VERIFIED: 6
		EXPIRED: 7


		# Archives a classified. Don't allow a classified to be archived if
		# it has been flagged, rejected or banned. Also ideally we would want
		# to prevent moderators from archiving a classified.
		archive: (id, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then return callback err
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				# Don't allow banned or flagged classifieds to be archived
				if classified.status in [that.BANNED, that.FLAGGED, that.REJECTED]
					error = new Error "unauthorized to change classified's status"
					error.status = 401
					return callback error

				classified.status = that.ARCHIVED

				classified.save (err) ->
					if err then callback err
					else callback null, classified


		# Bans a classified, with the given reason. This is an action that
		# should be performed only by a moderator.
		ban: (id, reason, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return callback error
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				classified.status = that.BANNED
				classified.adminReason = reason

				classified.save (error) ->
					if error then callback error
					else callback null, classified


		# Reposts the given classified. Avoids reposting classified that are
		# either banned, rejected or flagged. Reposting a guest classified
		# makes it an inactive classified awaiting for moderations. Normal
		# classifieds get published automatically.
		repost: (id, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return callback error
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				if classified.status in [that.BANNED, that.FLAGGED, that.REJECTED]
					error = new Error "unauthorized to change classified's status"
					error.status = 401
					return callback error

				if classified.guest then classified.status = that.INACTIVE
				else classified.status = that.ACTIVE

				classified.save (error) ->
					if error then callback error
					else callback null, classified


		# Publishes the a classified. This makes the classified viewable by
		# search queries. Ideally when a user reposts a normal classified
		# it gets set to ACTIVE and the same when a moderator approves a guest
		# classified.
		publish: (id, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return callback error
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				classified.status = that.ACTIVE

				classified.save (error) ->
					if error then callback error
					else callback null, classified


		# Rejects the a classified with the given reason. This is a moderator
		# only action. The reason for rejecting the classified should be
		# mentioned
		reject: (id, reason, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return callback error
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				classified.status = that.REJECTED
				classified.adminReason = reason

				classified.save (error) ->
					if error then callback error
					else callback null, classified


		# Sets the classified to inactive. Don't know why we really need such
		# a function.
		inactive: (id, callback) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return callback error
				if not classified
					error = new Error "not found"
					error.status = 404
					return callback error

				classified.status = that.INACTIVE

				classified.save (error) ->
					if error then callback error
					else callback null, classified



# Helper function to create a random hash with a GUID-type format
randomHash = ->
	s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
	s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()

###	# Finds out how many classifieds are there in each category.
	classifiedsPerCategory: (callback) ->
		# The Mongo way of grouping and counting!
		agg = [{
			$group:
				_id: '$category'
				total: $sum: 1
		}]

		model.aggregate agg, (err, result) ->
			if error then callback error
			callback null, result
###