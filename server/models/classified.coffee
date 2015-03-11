async    = require 'async'
mongoose = require 'mongoose'
util     = require 'util'
xss      = require 'xss'

file = require('../controllers/helpers/file')

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

	# Creates a classified from the POST parameters passed from the request.
	createFromPOST: (request, user, callback) ->
		that = this
		that._doFiles request, (data) ->
			# that._doData(data, user, callback);
			return
		return

	addFiles: (id, files) ->
		@model.findOne { _id: id }, (err, classified) ->
			if err
				throw err
			if not classified
				return
			classified.perks.urgent = true
			classified.save()
			return
		file.upload request, (data) ->
			callback data
			return
		return

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
			return callback(null)

		# Check for any invalid fields
		if not hexRegex.test(data.category) or not hexRegex.test(data.contact.location) or not numberRegex.test(data.contact.phone) or data.meta.gmapX and not numberRegex.test(data.meta.gmapX) or data.meta.gmapY and not numberRegex.test(data.meta.gmapY) or not numberRegex.test(data.price) or not numberRegex.test(data.type)
			return callback(null)

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
			callback classified


	# Gets a single classified, given it's id
	get: (id, callback) ->
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
		archive: (id) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then throw err
				if not classified then return

				# Don't allow banned or flagged classifieds to be archived
				if classified.status is that.BANNED or classified.status is that.FLAGGED
					return
				classified.status = that.ARCHIVED
				classified.save()


		# Bans a classified, with the given reason
		ban: (id, reason) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then throw err
				if not classified then return

				classified.status = that.BANNED
				classified.adminReason = reason
				classified.save()

		# Reposts the given classified. Avoids reposting classified that are
		# either banned, rejected or flagged. Reposting a guest classified
		# makes it an inactive classified awaiting for moderations. Normal
		# classifieds get published automatically.
		repost: (id) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then throw err
				if not classified then return

				if classified.status == that.BANNED or
					classified.status == that.FLAGGED or
					classified.status == that.REJECTED then return

				if classified.guest then classified.status = that.INACTIVE
				else classified.status = that.ACTIVE

				classified.save()

		# Publishes the a classified.
		publish: (id) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then throw err
				if not classified then return

				classified.status = that.ACTIVE
				classified.save()

		# Rejects the a classified with the given reason
		reject: (id, reason) ->
			that = this
			classifieds.model.findOne { _id: id }, (err, classified) ->
				if err then throw err
				if not classified then return

				classified.status = that.REJECTED
				classified.adminReason = reason
				classified.save()


# Helper function to create a random hash with a GUID-type format
randomHash = ->
	s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
	s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()