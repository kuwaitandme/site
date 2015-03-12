expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'create()', ->
	beforeEach ->
		sampleClassified =
			category: "54e0edd16bbf4aa24bb3b7c0"
			description: "description goes here"
			guest: true
			price: "123"
			title: "A test title"
			type: "0"
			contact:
				address1: "Address line 1"
				address2: "Address line 2"
				email: "a@mail.com"
				location: "54e0edd16bbf4aa24bb3b7c0"
				phone: "9123123123"
			meta:
				gmapX: "123"
				gmapY: "123"


	describe 'don\'t commit empty classifieds', ->
		it 'empty classified', (done) ->
			classifiedModel.create null, null, (cl) ->
				(expect cl).to.be(null)
				done()


	describe 'don\'t commit if required fields are missing', ->
		it 'missing email', (done) ->
			sampleClassified.contact.email = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing location', (done) ->
			sampleClassified.contact.location = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing title', (done) ->
			sampleClassified.title = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing description', (done) ->
			sampleClassified.description = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing price', (done) ->
			sampleClassified.price = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing type', (done) ->
			sampleClassified.type = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()

		it 'missing category', (done) ->
			sampleClassified.category = ""

			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.be(null)
				done()


	describe 'try committing a valid classified', ->
		it 'sample classified', (done) ->
			classifiedModel.create sampleClassified, null, (cl) ->
				(expect cl).to.not.be(null)
				done()