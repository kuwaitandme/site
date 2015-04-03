expect           = require 'expect.js'
supertest        = require 'supertest'

app = global.app
classifiedModel  = global.models.classified


describe 'get():', ->
  it 'don\'t fetch a classified with invalid id', (done) ->
    supertest app
    .get '/api/classified/5501d$#d4502fd9d4a28@8Z4'
    .expect 404, done


  it 'don\'t fetch a classified without the id', (done) ->
    supertest app
    .get '/api/classified/'
    .expect 404, done


  it 'don\'t fetch a classified without a non-existent id', (done) ->
    supertest app
    .get '/api/classified/111111111111111111111111'
    .expect 404, done


  it 'fetch a classified with a existent id', (done) ->
    classifiedModel.model.findOne {}, (err, classified) ->
      classified

      supertest app
      .get "/api/classified/#{classified._id}"
      .expect JSON.stringify classified
      .expect 200, done