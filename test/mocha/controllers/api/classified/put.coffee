expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'put():', ->
	describe 'create a new classified', ->
		it 'create a guest classified with correct details', ->
		it 'create a normal classified with correct details', ->
		it 'return newly created classified on success', ->
		it 'save a valid classified on success', ->
		it 'save new classified in the DB', ->


	describe 'don\'t create if required fields are missing', ->
		it 'reject if no data is sent', ->
		it 'reject if missing category', ->
		it 'reject if missing category', ->
		it 'reject if missing description', ->
		it 'reject if missing email', ->
		it 'reject if missing location', ->
		it 'reject if missing price', ->
		it 'reject if missing title', ->
		it 'reject if missing type', ->


	describe 'don\'t create if any fields are invalid', ->
		it 'reject for bad category', ->
		it 'reject for bad email', ->
		it 'reject for bad gmap co-ordinates (X)', ->
		it 'reject for bad gmap co-ordinates (Y)', ->
		it 'reject for bad location', ->
		it 'reject for bad phone-number', ->
		it 'reject for non-existent category', ->
		it 'reject for non-existent location', ->