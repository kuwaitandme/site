expect           = require "expect.js"
supertest        = require "supertest"


route = "/api/users/current"
loginRoute = "/api/auth/email/login"


exports = module.exports = (IoC) -> (app) ->
  describe "#{route} GET", ->
    agent = supertest.agent app

    it "Content-Type must be JSON", (done) ->
      supertest.agent app
      .get route
      .expect "Content-Type", /json/
      .end done


    describe "if user is not logged in then", ->
      it "return {}", (done) ->
        supertest.agent app
        .get route
        .expect 200
        .expect {}
        .end done


    describe "if user is logged in then", ->
      cookie = null

      beforeEach (done) ->
        supertest.agent app
        .post loginRoute
        .send
          password: "stevent95@gmail.com"
          username: "stevent95@gmail.com"
        .end (error, response) ->
          if error then return done error
          cookie = response.headers["set-cookie"]
          done()

      it "return a valid JSON of the user", (done) ->
        supertest app
        .get route
        .set "cookie", cookie
        .expect 200
        .end (error, response) ->
          if error then return done error

          try json = JSON.parse response.text
          catch e then return done e

          if json.email is not "stevent95@gmail.com" or
          not json.full_name? then return done "current user is not the same"

          if json.password then return done "password is visible"

          done()

      it "make sure JSON matches the user", (done) ->
        supertest app
        .get route
        .set "cookie", cookie
        .expect 200
        .end (error, response) ->
          if error then return done error
          json = JSON.parse response.text

          if json.email is not "stevent95@gmail.com" or
          not json.full_name? then return done "current user is not the same"

          if not json.id? then return done "id is missing"

          done()

      it "make sure sensitive fields are hidden", (done) ->
        supertest app
        .get route
        .set "cookie", cookie
        .expect 200
        .end (error, response) ->
          if error then return done error
          json = JSON.parse response.text

          if json.password then return done "password is visible"
          done()


exports["@require"] = ["$container"]
exports["@singleton"] = true
