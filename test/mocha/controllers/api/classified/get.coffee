expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'get():', ->
	it 'don\'t fetch a classified with invalid id', (done) ->
		done()
	it 'don\'t fetch a classified without the id', (done) ->
		done()
	it 'don\'t fetch a classified without a non-existent id', (done) ->
		done()
	it 'fetch a classified with a existent id', (done) ->
		done()