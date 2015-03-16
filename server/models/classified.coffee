async    = require 'async'
mongoose = require 'mongoose'
util     = require 'util'
xss      = require 'xss'

file     = require '../controllers/helpers/file'

Schema   = mongoose.Schema
ObjectId = Schema.ObjectId

classifieds = module.exports =
	model: mongoose.model('classified',
		# Basic properties
		category: ObjectId
		created: Date
		description: String
		images: [ String ]
		price: Number
		status: Number # 0:Inactive,1:Active,2:Rejected,3:Archived,4:Banned
		title: String
		type: Number # 0:Sale,1:Want
		views: Number

		# Admin related properties
		adminReason: String
		authHash: String
		guest: Boolean
		owner: ObjectId
		reports: [{
			reason: String
			ip: String
		}]
		perks:
			urgent: Boolean
			promote: Boolean

		# Contact information
		contact:
			address1: String
			address2: String
			email: String
			location: ObjectId
			phone: String

		# Extra meta properties
		meta:
			gmapX: Number
			gmapY: Number)

	classifiedPerPage: 15
	reportsPerPostBeforeFlag: 3


	# This function creates the classified object and saves it into the DB. The
	# classified will be validated and filtered for bad fields before getting
	# saved into the DB.
	create: (data, user, callback) ->
		classified = new (@model)
		hexRegex = /^[0-9a-f]*$/
		numberRegex = /^[0-9\.-]*$/i
		requiredRegex = /^(?!\s*$).+/

		# Check for any empty fields
		if not data or not requiredRegex.test(data.category) or not requiredRegex.test(data.contact.email) or not requiredRegex.test(data.description) or not requiredRegex.test(data.price) or not requiredRegex.test(data.title) or not requiredRegex.test(data.type) or not requiredRegex.test(data.contact.location)
			return callback('emptyfields', null)

		# Check for any invalid fields
		if not hexRegex.test(data.category) or not hexRegex.test(data.contact.location) or (data.meta.gmapX and not numberRegex.test(data.meta.gmapX)) or (data.meta.gmapY and not numberRegex.test(data.meta.gmapY)) or not numberRegex.test(data.price) or not numberRegex.test(data.type)
			return callback('invalidfields', null)

		# Start saving the fields one by one
		classified.category = data.category
		classified.contact.address1 = xss(data.contact.address1)
		classified.contact.address2 = xss(data.contact.address2)
		classified.contact.email = xss(data.contact.email)
		classified.contact.location = xss(data.contact.location)
		classified.contact.phone = data.contact.phone
		classified.description = xss(data.description)
		classified.images = data.images
		classified.meta.gmapX = data.meta.gmapX
		classified.meta.gmapY = data.meta.gmapY
		classified.price = data.price
		classified.saleby = data.saleby
		classified.title = xss(data.title)
		classified.type = data.type

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
		# console.log(classified)
		if user and user._id
			classified.owner = user._id
			classified.guest = false
			classified.status = @status.ACTIVE
		else
			classified.status = @status.INACTIVE
			classified.guest = true

		# Commit to the database and call the callback function
		classified.save (err) ->
			if err then throw err
			callback null, classified


	# Gets a single classified, given it's id
	get: (id, callback) ->
		# Check if id is valid
		if not /^[0-9A-F]{24}$/i.test(id) then return callback null

		@model.findOne { _id: id }, (err, result) ->
			if err then throw err
			callback result


	# Finds out how many classifieds are there in each category.
	classifiedsPerCategory: (callback) ->
		# The Mongo way of grouping and counting!
		agg = [{
			$group:
				_id: '$category'
				total: $sum: 1
		}]

		@model.aggregate agg, (err, result) ->
			if err then throw err
			callback result


	#  Finds all the classifieds with the given parameters. EXPLAIN
	search: (parameters, callback, page, reverse) ->
		if not page then page = 1
		if reverse then sort = 1 else sort = -1

		# Prepare a query which searchs with the given parameter and offsets
		# and limits with the 'classifieds per page' and 'page index' parameters
		query = @model.find(parameters, authHash: 0)
			.sort(created: sort)
			.skip(if page > 0 then (page - 1) * @classifiedPerPage else 0)
			.limit(@classifiedPerPage)

		query.exec (err, result) ->
			if err then throw err
			callback result


	# Labels a classified as an urgent classified
	makeUrgent: (id) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then throw err
			if classified
				classified.perks.urgent = true
				classified.save()


	# Promotes a classified
	promote: (id) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then throw err
			if classified
				classified.perks.promote = true
				classified.save()


	# Increments the view counter of the classified
	incrementViewCounter: (id) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then throw err
			if classified
				if not classified.views then classified.views = 1
				else classified.views += 1
				classified.save()


	# Add a report to the classified with the given reason. If the user is
	# spamming this classified then the report gets rejected. If the classified
	# has too many reports then it gets flagged for a moderator to be review.
	report: (id, reason, ip) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err then throw err
			if not classified then return

			# Check if the same ip is flagging the classified or not, to avoid
			# spam
			spam = false
			for report in classified.reports
				if report.ip is ip then spam = true

			if spam then return

			# If it was a valid report, add it to the list of reports
			classified.reports.push
				ip: ip
				reason: reason

			# Check if this classified has reached it's limit for it to be
			# reviewed by an admin
			if classified.reports.length > @reportsPerPostBeforeFlag
				classified.status = @status.FLAGGED

			# Commit to the database
			classified.save()

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


		# Archives a classified
		archive: (id, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then return finish err
				if not classified then return finish new Error "not found"

				# Don't allow banned or flagged classifieds to be archived
				if classified.status is that.BANNED or
				classified.status is that.FLAGGED
					error = new Error "unauthorized to change classified's status"
					error.status = 401
					return finish error

				classified.status = that.ARCHIVED

				classified.save (err) ->
					if err then finish err
					else finish null, classified


		# Bans a classified, with the given reason
		ban: (id, reason, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then return finish err
				if not classified then return finish new Error "not found"

				classified.status = that.BANNED
				classified.adminReason = reason

				classified.save (err) ->
					if err then finish err
					else finish null, classified


		# Reposts the given classified. Avoids reposting classified that are
		# either banned, rejected or flagged. Reposting a guest classified
		# makes it an inactive classified awaiting for moderations. Normal
		# classifieds get published automatically.
		repost: (id, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return finish error
				if not classified then return finish new Error "not found"

				if classified.status is that.BANNED or
					classified.status is that.FLAGGED or
					classified.status is that.REJECTED then
					error = new Error "unauthorized to change classified's status"
					error.status = 401
					return finish error

				if classified.guest then classified.status = that.INACTIVE
				else classified.status = that.ACTIVE

				classified.save (error) ->
					if error then finish error
					else finish null, classified


		# Publishes the a classified.
		publish: (id, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return finish error
				if not classified then return finish new Error "not found"

				classified.status = that.ACTIVE

				classified.save (error) ->
					if error then finish error
					else finish null, classified


		# Rejects the a classified with the given reason
		reject: (id, reason, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return finish error
				if not classified then return finish new Error "not found"

				classified.status = that.REJECTED
				classified.adminReason = reason

				classified.save (error) ->
					if error then finish error
					else finish null, classified


		# Sets the classified to inactive
		inactive: (id, finish) ->
			that = this
			classifieds.model.findOne { _id: id }, (error, classified) ->
				if error then return finish error
				if not classified then return finish new Error "not found"

				classified.status = that.INACTIVE

				classified.save (error) ->
					if error then finish error
					else finish null, classified



# Helper function to create a random hash with a GUID-type format
randomHash = ->
	s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
	s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()