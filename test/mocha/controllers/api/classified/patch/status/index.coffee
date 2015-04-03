expect           = require 'expect.js'
supertest        = require 'supertest'

classifiedModel  = global.models.classified
app              = global.app


# normalClassifiedTests = require './normalClassified'
sampleClassified =
sampleGuestClassified =


before (done) ->
  classifiedModel.model.findOne {guest: false}, (err, classified) ->
    sampleClassified = classified

    classifiedModel.model.findOne {guest: true}, (err, classified) ->
      sampleGuestClassified = classified
      done()


describe 'for a valid id of a guest classified:', ->
  it 'if authHash is missing return 401', (done) ->
    cl = sampleGuestClassified
    supertest app
    .patch "/api/classified/#{cl._id}"
    .send status: 0
    .expect '"unauthorized"'
    .expect 401, done

  require './guestClassified'

describe 'for a valid id of a non-guest classified:', ->
  require './normalClassified'
#   normalClassifiedTests sampleClassified