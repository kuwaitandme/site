expect           = require "expect.js"
supertest        = require "supertest"


route = "/api/auth/email/signup"

exports = module.exports = (IoC) -> (app) ->
  # A helper function to shorten most of the common operations
  post = -> supertest.agent(app).post route

  # A helper function to check for the 400 errors
  expect400 = (data, text, done) ->
    post()
    .send data
    .expect 400
    .expect JSON.stringify text
    .end done


  describe "#{route} POST - Signup API", ->
    it "Content-Type must be JSON", (done) ->
      post().expect "Content-Type", /json/
      .end done


    describe "get HTTP 400", ->
      describe "for invalid POST parameters", ->
        it.skip "with invalid reCaptcha", (done) ->

        it.skip "with invalid CSRF", (done) ->

        it "with no parameters", (done) -> expect400 {}, "missing fields", done

        it "with invalid parameters", (done) ->
          expect400 {dog: "cat"}, "missing fields", done

        it "with missing email", (done) ->
          expect400
            full_name: "idontexist"
            password: "password"
          , "missing fields", done

        it "with missing password", (done) ->
          expect400
            email: "fake@mail.com"
            full_name: "idontexist"
          , "missing fields", done

        it "with missing full name", (done) ->
          expect400
            password: "password"
            email: "fake@mail.com"
          ,  "missing fields", done

        it "with invalid email", (done) ->
          expect400
            password: "password"
            full_name: "idontexist"
            email: "fake123"
          , "bad email/name", done

        it "with invalid full name", (done) ->
          expect400
            password: "password"
            full_name: "auisdjaiudh2123-=-;';,[]"
            email: "fake123"
          , "bad email/name", done

        it "with short password", (done) ->
          expect400
            password: "1"
            full_name: "idontexist"
            email: "fake@mail.com"
          , "short password", done


      describe "for valid parameters but conflicting values", ->
        it.skip "with disposable email", (done) ->
          expect400
            email: "fake@mail.com"
            full_name: "idontexist"
            password: "password"
          , "missing fields", done

        it.skip "with already registered (ACTIVE) email", (done) ->
          expect400
            email: "fake@mail.com"
            full_name: "idontexist"
            password: "password"
          , "missing fields", done


    describe.skip "for a successful signup", ->
      it "ensure that XSS code is filtered out", (done) -> done()

      it "ensure the return code is valid JSON", (done) -> done()

      it "ensure the password and activation field is hidden", (done) -> done()

      it "ensure that a session cookie is set", (done) ->
        user.end (error, response) ->
          if response.header["set-cookie"]? then return done()
          else return done "missing 'set-cookie' header"
          cookies = response.header["set-cookie"]
          for cookie in cookies
            if cookie.indexOf("connect.sid=") is -1 then return done()
          done "'set-cookie' is missing session's cookie"


exports["@require"] = ["$container"]
exports["@singleton"] = true
