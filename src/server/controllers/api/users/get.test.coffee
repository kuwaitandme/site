expect           = require "expect.js"
supertest        = require "supertest"


route = "/api/users"


exports = module.exports = (IoC, Users) -> (app) ->

  testFor = (route, HTTPcode, json, done) ->
    supertest.agent app
    .get route
    .expect HTTPcode
    .expect JSON.stringify json
    .end done

  users = []
  describe "#{route} GET", ->
    # Before any of the tests are run, we query the DB for the actual values
    # in the DB.
    before (done) ->
      Users.query {}
      .then (results) ->
        if results.length < 1
          throw new Error "There has to be at least one user in the DB to test
          #{route} GET"
        users = results.toJSON()
        done()
      .catch done

    it "Content-Type must be JSON", (done) ->
      validUserID = users[0].id
      supertest.agent app
      .get "#{route}/#{validUserID}"
      .expect "Content-Type", /json/
      .end done

    describe "Give a proper 404 when the", ->

      it "id is invalid", (done) ->
        supertest.agent app
        .get "#{route}/1123qwerty"
        .expect 404
        .end done

      it "id is negative", (done) ->
        supertest.agent app
        .get "#{route}/-1"
        .expect 404
        .end done

      it "id is positive but huge for Postgres Integer", (done) ->
        supertest.agent app
        .get "#{route}/202020200202021123"
        .expect 404
        .expect JSON.stringify "user not found"
        .end done

      it "id is positive but doesn't exist", (done) ->
        supertest.agent app
        .get "#{route}/2147483646"
        .expect 404
        .expect JSON.stringify "user not found"
        .end done


    describe "When the id is valid and is of a existing user", (done) ->
      get = ->
        user = users[0]
        supertest.agent app
        .get "#{route}/#{user.id}"
        .expect 200

      it "ensure it is a valid JSON object", (done) ->
        get().end (error, response) ->
          try
            obj = JSON.parse response.text
            if typeof obj is "object" then done()
            else done new Error "not an object"
          catch e then done e

      it "ensure sensitive fields are removed", (done) ->
        get().end (error, response) ->
          try
            obj = JSON.parse response.text
            if obj.meta? or obj.password? or obj.role? or
            obj.login_providers? or obj.credits?
              done new Error "sensitive fields are shown"
            else done()
          catch e then done e

      it "ensure necessary fields are shown and match", (done) ->
        user = users[0]
        get().end (error, response) ->
          try
            delete user.meta
            delete user.password
            delete user.role
            delete user.login_providers
            delete user.credits
            userJSON = JSON.stringify user, null, 2
            if userJSON is response.text then done()
            else done new Error "response JSON has unwanted/wrong fields"
          catch e then done e


exports["@require"] = [
  "$container"
  "models/users"
]
exports["@singleton"] = true
