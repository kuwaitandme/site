expect           = require "expect.js"
supertest        = require "supertest"
w3c              = require("w3c-validate").createValidator()
Promise          = require "bluebird"


exports = module.exports = (IoC, Classifieds) -> (app) ->

  ###*
   * This helper checks if the given redirect route actually returns a URL
   * pointing to the classified with it's slug. It returns a promise so that
   * we can use promise functions to chain for multiple classifieds
   *
   * @param  Object classified      The JSON of the classified to test for.
   * @return Promise                A promise containing the state of the test.
  ###
  checkForRedirect = (classified) ->
    new Promise (resolve, reject) ->
      supertest app
      .get "/c/#{classified.id}"
      .expect 302
      .end (error, response) ->
        if error then return reject error
        if -1 is response.headers.location.indexOf "/#{classified.slug}"
          return reject new Error "classified redirect mismatch for id: #{id}"
        resolve()


  ###*
   * This helper function checks if the given id returns a proper 404, provided
   * that the id doesn't exist.
   *
   * @param String   id           The id to test for.
   * @param Function done         Mocha's done function to be passed here
  ###
  checkForBadRedirect = (id, done) ->
    supertest app
    .get "/c/#{id}"
    .expect 404, done


  describe "check if the classified redirector", ->
    classifieds = null
    sampleClassified = null

    before (done) ->
      Classifieds.query {}
      .then (results) ->
        if results.length < 1
          done new Error "There must be at least one classified in the DB to
            test the classified-redirector"
        classifieds = results.toJSON()
        sampleClassified = classifieds[0]
        done()

    it "can redirect correctly for classified with different ids", (done) ->
      promises = []
      promises.push checkForRedirect classified for classified in classifieds
      Promise.all promises
      .then -> done()
      .catch done

    it "returns 404 if classified id is missing", (done) ->
      checkForBadRedirect "", done

    it "returns 404 if classified id is not numeric", (done) ->
      checkForBadRedirect "bad-number", done

    it "returns 404 if classified id is invalid", (done) ->
      checkForBadRedirect "-1", done


exports["@require"] = [
  "$container"
  "models/classifieds"
]
exports["@singleton"] = true
