#!/usr/bin/env coffee

# This file is responsible for sending an email to all the moderators everyday
# with list of all the classifieds that have to be reviewed.
#
# It sends an email to all moderators as well as CCs the site admins in the
# mail.
#
# Ideally, you would want to link the file inside of the /etc/cron.daily folder
# so that cron runs it once every day.
#
# ln -s `pwd`/bin/cron.daily /etc/cron.daily/kuwaitandme

email       = require('emailjs')
jade        = require('jade')
mongoose    = require('mongoose')
util        = require('util')
mongoClient = require('mongodb').MongoClient

classified  = require('../server/models/classified')
config      = require('../var/config')

console.log('connecting to the DB')
dbauth = config.mongodb

# Setup the database connection
connectionString = "mongodb://#{dbauth.username}:#{dbauth.password}@#{dbauth.host}/#{dbauth.database}"

mongoClient.connect connectionString, (err, db) ->
	if err then throw err

	console.log 'fetching classifieds'
	collection = db.collection('classifieds')
	collection.find(status: classified.status.INACTIVE).toArray (err, classifieds) ->
		if err then throw err

		console.log classifieds.length + ' classified(s) fetched'

		# Don't send the report if there are no unpublished classifieds
		if classifieds.length == 0 then return process.exit()


		# Prepare the plain-text body
		console.log 'preparing email body (plaintext)'
		text = ''
		for cl in classifieds
			text += util.format('%d.\t %s \n \t %s\n\n', i + 1, cl.title, 'http://kuwaitandme.com/classified/single/' + cl._id)

		# Prepare the plain-text header
		header = util.format('%d  unpublished classified(s) for review today\n', i)
		header += '-----------------------------------------------\n'


		# Render the HTML version of the email
		console.log 'preparing email body (HTML)'
		template = jade.compileFile(__dirname + '/../server/views/email/daily-report.jade')
		html = template
			classifieds: classifieds
			host: 'https://kuwaitandme.com'


		# Connect to the SMTP server
		console.log 'connecting to SMTP server'
		server = email.server.connect(
			user: config.email.smtp.username
			password: config.email.smtp.password
			host: config.email.smtp.hostname
			ssl: config.email.smtp.ssl)


		# Start sending the message
		console.log 'sending email to admin'
		server.send {
			attachment: [ {
				data: html
				alternative: true
			} ]
			from: config.email.fromAddress
			subject: 'Kuwait & Me - Daily report'
			text: header + text
			to: config.email.reportAddress
		}, (err, message) ->
			if err then throw err

			console.log 'all done'
			process.exit()