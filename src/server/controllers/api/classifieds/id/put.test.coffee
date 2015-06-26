expect           = require "expect.js"
supertest        = require "supertest"
should           = require "should"

route = "/api/classifieds"


exports = module.exports = (IoC, Classifieds, Users) -> (app) ->
  users = []
  downloadedClassified = null

  put = -> supertest.agent(app).put route
  putClassified = (classified, user) ->
    if user? then user.put(route).field "classified", JSON.stringify classified
    else put().field "classified", JSON.stringify classified

  getSampleClassified = -> JSON.parse JSON.stringify downloadedClassified


  describe "#{route} PUT:", ->
    user = null

    before "login as default user", (done) ->
      user = supertest.agent app
      user.post "/api/auth/email/login"
      .send
        password: "stevent95@gmail.com"
        username: "stevent95@gmail.com"
      .expect 200
      .end done


    before "load a sample classified", (done) ->
      Classifieds.query {}
      .then (classifieds) ->
        if not classifieds.length? or classifieds.length < 1
          done new Error "There must be at least one classified in DB to test
            this module"
        downloadedClassified = classifieds.toJSON()[0]
        route += "/#{downloadedClassified.id}"
        done()


    it "Content-Type must be JSON", (done) ->
      put()
      .expect "Content-Type", /json/
      .end done


    describe "for invalid parameters give 400 when", ->
      it "classified field is missing", (done) ->
        put()
        .expect 400
        .expect JSON.stringify "missing classified field"
        .end done

      it "classified field is not a JSON", (done) ->
        put()
        .field "classified", "i-am-not-a-JSON"
        .expect 400
        .expect JSON.stringify "classified field is not a JSON"
        .end done

      it "classified field is a JSON but user is not logged in", (done) ->
        putClassified {}
        .expect 400
        .expect JSON.stringify "need login"
        .end done

      describe "admin is logged in and", ->
        user = null
        classified = null

        # Helper function to submit the test classified and expect the given
        # message from the API
        check = (message, done) ->
          putClassified classified, user
          .expect JSON.stringify message
          .end done

        beforeEach "reset test classified", -> classified = getSampleClassified()

        it "description is empty", (done) ->
          delete classified.description
          check 'instance requires property "description"', done

        it "description is too long (>2000)", (done) ->
          classified.description = Array(2005).join "x"
          check "instance.description does not meet maximum length of 2000", done

        it "description is too short (<50)", (done) ->
          classified.description = "short"
          check "instance.description does not meet minimum length of 50", done

        it "title is empty", (done) ->
          delete classified.title
          check "instance requires property \"title\"", done

        it "title is too long (>140)", (done) ->
          classified.title = Array(145).join "x"
          check "instance.title does not meet maximum length of 140", done

        it "title is too short (<20)", (done) ->
          classified.title = "short"
          check "instance.title does not meet minimum length of 20", done

        it "price_type is empty", (done) ->
          delete classified.price_type
          check "instance requires property \"price_type\"", done

        it "price_type is not valid", (done) ->
          classified.price_type = "dog"
          check "instance.price_type is not of a type(s) integer", done

        it "price_value is not valid", (done) ->
          classified.price_value = "dog"
          check "instance.price_value is not of a type(s) integer", done

        it "price_value is empty but price_type is CUSTOM", (done) ->
          classified.price_type = 2
          delete classified.price_value
          check "instance.price_value must not be empty when instance.price_type
            is CUSTOM", done

        it "parent_category is empty", (done) ->
          delete classified.parent_category
          check "instance requires property \"parent_category\"", done

        it "location is empty", (done) ->
          delete classified.location
          check "instance requires property \"location\"", done

        it.skip "child_category is empty", (done) ->
          delete classified.child_category
          check "instance requires property \"child_category\"", done

        it "parent_category is not valid", (done) ->
          classified.parent_category = "dog"
          check "instance.parent_category is not of a type(s) integer", done

        it.skip "parent_category doesn't exist in DB", (done) ->

        it "child_category is not valid", (done) ->
          classified.child_category = "dog"
          check "instance.child_category is not of a type(s) integer", done

        it.skip "child_category doesn't exist in DB", (done) ->

        it "location is not valid", (done) ->
          classified.location = "dog"
          check "instance.location is not of a type(s) integer", done

        it.skip "location doesn't exist in DB", (done) ->

        describe "for image field when", ->
          it "it is not valid", (done) ->
            classified.images = "dog"
            check "instance.images is not of a type(s) array", done

        describe "for meta field when", ->
          it "it is not valid", (done) ->
            classified.meta = "dog"
            check "instance.meta is not of a type(s) object", done

        describe "for contact field when", ->
          it "it is not valid", (done) ->
            classified.contact = "dog"
            check "instance.contact is not of a type(s) object", done

    # describe.skip "for valid parameters and logged in user; response should", ->
    #   # savedClassified = null

    #   before "post a valid classified", (done) ->
    #     originalClassified = getGoodClassified()
    #     putClassified originalClassified, user
    #     .expect 200
    #     .end (error, response) ->
    #       if error then return done error
    #       savedClassified = response.body
    #       done()

    #   it "be a valid JSON", ->
    #     savedClassified.should.be.a.Object()

    #   it "have id set", ->
    #     savedClassified.should.have.property "id"
    #     .which.is.a.Number()
    #     .and.is.above 0

    #   it "have a proper slug set", ->
    #     savedClassified.should.have.property "slug"
    #     .which.is.a.String()
    #     # This makes sure that it matches our format for slugs
    #     .and.match /[a-z\-]+-[0-9]+/

    #   it "have an owner set", ->
    #     savedClassified.should.have.property "owner"
    #     .which.is.a.Number()
    #     .and.is.above 0

    #   it "have status should be set to INACTIVE", ->
    #     savedClassified.should.have.property "status"
    #     .which.is.a.Number()
    #     .and.is.exactly 0

    #   it "have XSS filters enabled", ->
    #     savedClassified.should.have.property "title"
    #     .which.is.a.String()
    #     .and.not.match /<script>/

    #   describe.skip "for images:[] fields have", ->
    #     it "all added images must be listed", ->
    #     it "all images must have the dominant color set", ->
    #     it "all images must exist in the filesystem", ->
    #     it "all images thumbnails must exist in the filesystem", ->
    #     it "all images must have width attribute set", ->
    #     it "all images must have height attribute set", ->
    #     it "one main image must be set", ->


exports["@require"] = [
  "$container"
  "models/classifieds"
  "models/users"
]
exports["@singleton"] = true
