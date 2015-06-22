expect           = require "expect.js"
supertest        = require "supertest"

module.exports = (app) ->

  checkRouteFor = (code, route) ->
    it "GET #{code} #{route}", (done) ->
      supertest(app).get(route).expect code, done

  describe "routes (non-api)", ->
    describe "check if routes are accessible (without authentication)", ->
      checkRouteFor 200, "/"
      checkRouteFor 200, "/classified"
      checkRouteFor 200, "/classified/create"
      checkRouteFor 200, "/info/terms-privacy"


      describe "requests that need authentication should redirect", ->
        checkRouteFor 302, "/account/classifieds"
        checkRouteFor 302, "/account/moderate"
        checkRouteFor 302, "/account/profile"
        checkRouteFor 302, "/account/credits"

      # describe "requests that need and have authentication should return 200", ->
      #   checkRouteFor 302, "/account/manage"
      #   checkRouteFor 302, "/account/profile"
      #   checkRouteFor 302, "/classified/post"
      #   checkRouteFor 302, "/credits"

      describe "routes with missing parameters should return 404", ->
        checkRouteFor 404, "/i-dont-exist"
        checkRouteFor 404, "/classified/i-dont-exist/i-dont-exist"

    describe "check if routes are accessible (with authentication)", ->
