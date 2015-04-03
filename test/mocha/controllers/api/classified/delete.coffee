expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'delete():', ->
  it 'don\'t delete a classified with invalid id', (done) ->
    done()
  it 'don\'t delete a classified without the id', (done) ->
    done()
  it 'don\'t delete a classified without a non-existent id', (done) ->
    done()
  it 'delete a classified with a existent id', (done) ->
    done()