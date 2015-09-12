expect           = require "expect.js"
supertest        = require "supertest"


route = "/api/auth/email/login"

exports = module.exports = (IoC) -> (app) ->
  # A helper function to shorten most of the common operations
  post = -> supertest.agent(app).post route


  describe "#{route} POST - Login API", ->
    it "Content-Type must be JSON", (done) ->
      post().expect "Content-Type", /json/
      .end done


    describe "get HTTP 400", ->
      describe "for invalid POST parameters", ->
        it.skip "with invalid reCaptcha", (done) ->

        it.skip "with invalid CSRF", (done) ->

        it "with no parameters", (done) ->
          post().send {}
          .expect 400
          .expect {}
          .end done

        it "with invalid parameters", (done) ->
          post().send {dog: "cat"}
          .expect 400
          .expect {}
          .end done

        it "with a missing username", (done) ->
          post().send password: "idontexist"
          .expect 400
          .expect {}
          .end done

        it "with a missing password", (done) ->
          post().send username: "idontexist"
          .expect 400
          .expect {}
          .end done


      describe "for valid POST parameters but bad creds", ->
        it "with a bad username", (done) ->
          post().send
            password: "fakepassword"
            username: "idontexist"
          .expect 400
          .expect JSON.stringify "bad username/email"
          .end done

        it "with a bad password", (done) ->
          post().send
            password: "fakepassword"
            username: "stevent95@gmail.com"
          .expect 400
          .expect JSON.stringify "password mismatch"
          .end done


    describe "for a valid login", ->
      user = null

      beforeEach ->
        user = post().send
          password: "stevent95@gmail.com"
          username: "stevent95@gmail.com"
        .expect 200

      it "get a valid JSON object", (done) ->
        user.end (error, response) ->
          try JSON.parse response.text
          catch e then return done e
          done()

      it "find the full_name and email fields", (done) ->
        user.end (error, response) ->
          json = JSON.parse response.text
          if not json.email? then done "no email field"
          else if not json.full_name? then done "no email field"
          else done()

      it "ensure that the password field is hidden", (done) ->
        user.end (error, response) ->
          json = JSON.parse response.text
          if json.password then done "password field is present"
          else done()

      it "ensure that a session cookie is set", (done) ->
        user.end (error, response) ->
          if response.header["set-cookie"]? then return done()
          else return done "missing 'set-cookie' header"
          cookies = response.header["set-cookie"]
          for cookie in cookies
            if cookie.indexOf("connect.sid=") is -1 then return done()
          done "'set-cookie' is missing session's cookie"


    describe.skip "for too many incorrect logins", ->
      describe "more than 50 times", ->
        it "ensure that the session is blocked from logging in", ->

      describe "more than 100 times", ->
        it "ensure that user account is blocked", ->
        it "ensure that a re-login token is set", ->


exports["@require"] = ["$container"]
exports["@singleton"] = true
