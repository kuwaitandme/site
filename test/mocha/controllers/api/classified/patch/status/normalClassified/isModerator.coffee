supertest        = require 'supertest'
statusHelper     = require '../helpers'
testUser         =
sampleClassified =
classifiedModel  = global.models.classified


describe 'user is a moderator:', ->
  before (done) ->
    testUser = supertest.agent global.app

    classifiedModel.model.findOne {guest: false}, (err, classified) ->
      classified.status = classifiedModel.status.ACTIVE
      sampleClassified = classified
      classified.save ->
        testUser.post '/api/auth/email/admin@mail.com'
        .send({ password: 'pass' })
        .expect 200, done

  it 'if attempting to set status ACTIVE return 200', (done) ->
    statusHelper sampleClassified, testUser, 'ACTIVE', 200, null, done

  it 'if attempting to set status REJECTED return 200', (done) ->
    statusHelper sampleClassified, testUser, 'REJECTED', 200, null, done

  it 'if attempting to set status INACTIVE return 200', (done) ->
    statusHelper sampleClassified, testUser, 'INACTIVE', 200, null, done

  it 'if attempting to set status BANNED return 200', (done) ->
    statusHelper sampleClassified, testUser, 'BANNED', 200, null, done

  it 'if attempting to set status ARCHIVED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'ARCHIVED', 401, '"moderators should not archive a classified"', done

  it 'if attempting to set status to a random integer return 400', (done) ->
    statusHelper sampleClassified, testUser, 123, 400, '"invalid status/reason"', done

  it 'if attempting to set status to something invalid return 400', (done) ->
    statusHelper sampleClassified, testUser, "i invalidate you", 400, '"invalid status/reason"', done