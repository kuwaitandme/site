supertest        = require 'supertest'
statusHelper     = require '../helpers'
testUser         =
sampleClassified =
classifiedModel  = global.models.classified

describe 'user is owner but not a moderator:', ->
  before (done) ->
    testUser = supertest.agent global.app

    classifiedModel.model.findOne {guest: false}, (err, classified) ->
      classified.status = classifiedModel.status.ACTIVE
      sampleClassified = classified
      classified.save ->
        testUser.post '/api/auth/email/jon@mail.com'
        .send({ password: 'pass' })
        .expect 200, done


  it 'if attempting to set status ACTIVE return 200', (done) ->
    statusHelper sampleClassified, testUser, 'ACTIVE', 200, null, done

  it 'if attempting to set status REJECTED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'REJECTED', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status INACTIVE return 401', (done) ->
    statusHelper sampleClassified, testUser, 'INACTIVE', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status BANNED return 401', (done) ->
    statusHelper sampleClassified, testUser, 'BANNED', 401, '"only a moderator can set that status"', done

  it 'if attempting to set status ARCHIVED return 200', (done) ->
    statusHelper sampleClassified, testUser, 'ARCHIVED', 200, null, done

  specialStatuses = ['BANNED', 'REJECTED', 'FLAGGED']
  specialStatusAction = (status) ->
    describe "if classified status is #{status}", ->
      before (done) ->
        classifiedModel.model.findOne {_id: sampleClassified._id}, (err, classified) ->
          classified.status = classifiedModel.status[status]
          sampleClassified = classified
          classified.save done

      it 'if attempting to set status ACTIVE return 401', (done) ->
        statusHelper sampleClassified, testUser, 'ACTIVE', 401, '"unauthorized to change classified\'s status"', done

      it 'if attempting to set status REJECTED return 401', (done) ->
        statusHelper sampleClassified, testUser, 'REJECTED', 401, '"only a moderator can set that status"', done

      it 'if attempting to set status INACTIVE return 401', (done) ->
        statusHelper sampleClassified, testUser, 'INACTIVE', 401, '"only a moderator can set that status"', done

      it 'if attempting to set status BANNED return 401', (done) ->
        statusHelper sampleClassified, testUser, 'BANNED', 401, '"only a moderator can set that status"', done

      it 'if attempting to set status ARCHIVED return 401', (done) ->
        statusHelper sampleClassified, testUser, 'ARCHIVED', 401, '"unauthorized to change classified\'s status"', done

      it 'if attempting to set status to a random integer return 400', (done) ->
        statusHelper sampleClassified, testUser, 123, 400, '"invalid status/reason"', done

      it 'if attempting to set status to something invalid return 400', (done) ->
        statusHelper sampleClassified, testUser, "i invalidate you", 400, '"invalid status/reason"', done

  specialStatusAction status for status in specialStatuses