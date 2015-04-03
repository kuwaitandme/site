expect           = require 'expect.js'
supertest        = require 'supertest'

classifiedModel  = global.models.classified
app              = global.app

describe 'patch():', ->
  before (done) ->
    classifiedModel.model.findOne {guest: false}, (err, classified) ->
      sampleClassified = classified

      classifiedModel.model.findOne {guest: true}, (err, classified) ->
        sampleGuestClassified = classified
        done()

  describe 'check for access based on id and request.data:', ->
    it 'if id is missing return 404', (done) ->
      supertest app
      .patch '/api/classified/'
      .expect '"need id"'
      .expect 404, done

    it 'if id is invalid return 400', (done) ->
      supertest app
      .patch '/api/classified/i-dont-exist'
      .expect '"invalid id"'
      .expect 400, done

    it 'if valid id but invalid parameters return 400', (done) ->
      supertest app
      .patch '/api/classified/111111111111111111111111'
      .expect '"patch only specific parameters"'
      .expect 400, done

    it 'if invalid id but valid parameters (status) return 404', (done) ->
      supertest app
      .patch '/api/classified/550587ae4171903c37309911'
      .send status: 0
      .expect 404, done

    it 'if invalid id but valid parameters (report) return 404', (done) ->
      supertest app
      .patch '/api/classified/550587ae4171903c37309911'
      .send reports: []
      .expect 404, done

    it 'if invalid id but valid parameters (perk) return 404', (done) ->
      supertest app
      .patch '/api/classified/550587ae4171903c37309911'
      .send perks: []
      .expect 404, done

  describe '[status]', ->
		require './status'