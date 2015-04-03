supertest        = require 'supertest'
statusHelper     = require '../helpers'
testUser         =
sampleClassified =
classifiedModel  = global.models.classified

describe 'user is a random user:', ->
  before (done) ->
    testUser = supertest.agent global.app
    classifiedModel.model.findOne {guest: false}, (err, classified) ->
      classified.status = classifiedModel.status.ACTIVE
      sampleClassified = classified
      classified.save ->
        testUser.post '/api/auth/email/a@mail.com'
        .send({ password: 'pass' })
        .expect 200, done


  it 'if attempting to set status ACTIVE return 401', (done) ->
    statusHelper sampleClassified, testUser, 'ACTIVE', 401, '"unauthorized"', done

  it 'if attempting to set status REJECTED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'REJECTED', 401, '"unauthorized"', done

  it 'if attempting to set status INACTIVE return 401', (done) ->
    statusHelper sampleClassified, testUser, 'INACTIVE', 401, '"unauthorized"', done

  it 'if attempting to set status BANNED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'BANNED', 401, '"unauthorized"', done

  it 'if attempting to set status ARCHIVED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'ARCHIVED', 401, '"unauthorized"', done

  it 'if attempting to set status to a random integer return 401', (done) ->
    statusHelper sampleClassified, testUser, 123, 401, '"unauthorized"', done

  it 'if attempting to set status to something invalid return 401', (done) ->
    statusHelper sampleClassified, testUser, "i invalidate you", 401, '"unauthorized"', done