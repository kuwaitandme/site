supertest        = require 'supertest'
statusHelper     = require '../helpers'
testUser         =
sampleClassified =
classifiedModel  = global.models.classified


describe 'for requests where authHash is set', ->
  before (done) ->
    testUser = supertest.agent global.app
    classifiedModel.model.findOne {guest: true}, (err, classified) ->
      classified.status = classifiedModel.status.ACTIVE
      sampleClassified = classified
      classified.save done

  it 'if attempting to set status ACTIVE return 401', (done) ->
    statusHelper sampleClassified, testUser, 'ACTIVE', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status REJECTED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'REJECTED', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status BANNED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'BANNED', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status ARCHIVED return 200', (done) ->
    statusHelper sampleClassified, testUser, 'ARCHIVED', 200, null, done

  it 'if attempting to set status INACTIVE return 200', (done) ->
    statusHelper sampleClassified, testUser, 'INACTIVE', 200, null, done