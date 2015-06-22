expect           = require "expect.js"
supertest        = require "supertest"
w3c              = require("w3c-validate").createValidator()

module.exports = (app) ->

  ###*
   * This helper function finds our if the given route contains valid HTML code
   *
   * @param  String route          The route to check
  ###
  checkforHTML = (route) ->
    it "has HTML code? #{route}", (done) ->
      supertest app
      .get route
      .expect "Content-Type", /text\/html/
      .end (err, res) ->
        if err then return done err
        w3c.validate res.text, done


  ###*
   * This helper function finds out if the given route returns with the given
   * code.
   *
   * @param  Number  code        The HTTP code to expect
   * @param  String  route       The route to check
  ###
  checkRouteFor = (code, route) ->
    it "GET #{code} #{route}", (done) ->
      supertest app
      .get route
      .expect code, done

  # Now we start the different tests
  describe.skip "routes (non-api)", ->
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

      describe.skip "requests that need & have authentication should return 200", ->
        checkRouteFor 302, "/account/manage"
        checkRouteFor 302, "/account/profile"
        checkRouteFor 302, "/classified/post"
        checkRouteFor 302, "/credits"

      describe "routes with missing parameters should return 404", ->
        checkRouteFor 404, "/classified/finish/i-dont-exist"
        checkRouteFor 404, "/classified/i-dont-exist"
        checkRouteFor 404, "/classified/i-dont-exist/i-dont-exist"
        checkRouteFor 404, "/i-dont-exist"

    describe "check if routes are accessible (with authentication)", ->

    describe.skip "check if all routes contain some HTML code", ->
      checkforHTML "/"
      checkforHTML "/classified"
      checkforHTML "/classified/create"
      checkforHTML "/classified/i-dont-exist"
      checkforHTML "/classified/i-dont-exist/i-dont-exist"
      checkforHTML "/i-dont-exist"
      checkforHTML "/info/terms-privacy"
