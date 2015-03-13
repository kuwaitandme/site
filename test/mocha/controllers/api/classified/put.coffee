expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'put():', ->
	describe 'create a new classified', ->
		it 'save a valid classified on success', (done) ->
			done()

		it 'return newly created classified on success', (done) ->
			done()

		it 'save new classified in the DB', (done) ->
			done()


	describe 'don\'t create if required fields are missing', ->
		it 'reject if no data is sent', (done) ->
			done()

		it 'reject if missing email', (done) ->
			done()

		it 'reject if missing category', (done) ->
			done()

		it 'reject if missing location', (done) ->
			done()

		it 'reject if missing title', (done) ->
			done()

		it 'reject if missing description', (done) ->
			done()

		it 'reject if missing price', (done) ->
			done()

		it 'reject if missing type', (done) ->
			done()

		it 'reject if missing category', (done) ->
			done()


	describe 'don\'t create if any fields are invalid', ->
		it 'reject for bad email', (done) ->
			done()
		it 'reject for bad phone-number', (done) ->
			done()
		it 'reject for bad category', (done) ->
			done()
		it 'reject for non-existent category', (done) ->
			done()
		it 'reject for bad location', (done) ->
			done()
		it 'reject for non-existent location', (done) ->
			done()
		it 'reject for bad gmap co-ordinates (X)', (done) ->
			done()
		it 'reject for bad gmap co-ordinates (Y)', (done) ->
			done()
		it 'reject for bad gmap co-ordinates (Y)', (done) ->
			done()