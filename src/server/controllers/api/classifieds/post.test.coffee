expect           = require "expect.js"
supertest        = require "supertest"
should           = require "should"

route = "/api/classifieds"


exports = module.exports = (IoC, Users) -> (app) ->
  users = []


  post = -> supertest.agent(app).post route
  postClassified = (classified, user) ->
    if user? then user.post(route).field "classified", JSON.stringify classified
    else post().field "classified", JSON.stringify classified

  getGoodClassified = ->
    title: "African Servals, fennec fox , Margay kittens , Cheetah Cubs , Egyptain Mau for sale"
    description: "African Servals, Margay kittens, Cheetah cubs, F1 Savanah Kittens , Ocelot kittens, fennec foxWell adjusted kittens guaranteed at reasonable prices. Pets or Show Cats. large & exotic looking kittens that are raised in our home Contact us for more details and pics email: mustafafridon@gmail.com"
    parent_category: 3
    child_category: 90
    location: 78
    price_type: 1
    price_value: 0
    language: 0
    status: 1
    images: [
      {
        filename: "114-201552321175462-Le1.JPG"
        height: 576
        main: true
        width: 377
        color: "#b19487"
        srcMain: "https://static.kuwaitandme.com/uploads/main/114-201552321175462-Le1.JPG"
      }
    ]
    meta: {}
    type: 0



  describe.only "#{route} POST", ->
    user = null
    # Before each test make sure that we login as the default user
    before "login as default user", (done) ->
      user = supertest.agent app
      user.post "/api/auth/email/login"
      .send
        password: "stevent95@gmail.com"
        username: "stevent95@gmail.com"
      .expect 200
      .end done

    it "Content-Type must be JSON", (done) ->
      post()
      .expect "Content-Type", /json/
      .end done


    describe "for invalid parameters give 400 when", ->
      it "classified field is missing", (done) ->
        post()
        .expect 400
        .expect JSON.stringify "missing classified field"
        .end done

      it "classified field is not a JSON", (done) ->
        post()
        .field "classified", "i-am-not-a-JSON"
        .expect 400
        .expect JSON.stringify "classified field is not a JSON"
        .end done

      it "classified field is a JSON but user is not logged in", (done) ->
        postClassified {}
        .expect 400
        .expect JSON.stringify "need login"
        .end done

      describe "user is logged in and", ->
        user = null
        classified = null

        # Helper function to submit the test classified and expect the given
        # message from the API
        check = (message, done) ->
          postClassified classified, user
          .expect JSON.stringify message
          .end done

        beforeEach "reset test classified", -> classified = getGoodClassified()

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

        it "images is not valid", (done) ->
          classified.images = "dog"
          check "instance.images is not of a type(s) array", done

        it "meta is not valid", (done) ->
          classified.meta = "dog"
          check "instance.meta is not of a type(s) object", done

        it "contact is not valid", (done) ->
          classified.contact = "dog"
          check "instance.contact is not of a type(s) object", done

    describe.skip "for valid parameters and logged in user; response should", ->
      originalClassified = getGoodClassified()
      savedClassified = null

      before "post a valid classified", (done) ->
        postClassified originalClassified, user
        .expect 200
        .end (error, response) ->
          if error then return done error
          savedClassified = response.body
          done()

      it "be a valid JSON", ->
        savedClassified.should.be.a.Object()

      it "have id set", ->
        savedClassified.should.have.property "id"
        .which.is.a.Number()
        .and.is.above 0

      it "have a proper slug set", ->
        savedClassified.should.have.property "slug"
        .which.is.a.String()
        # This makes sure that it matches our format for slugs
        .and.match /[a-z\-]+-[0-9]+/

      it "have an owner set", ->
        savedClassified.should.have.property "owner"
        .which.is.a.Number()
        .and.is.above 0


exports["@require"] = [
  "$container"
  "models/users"
]
exports["@singleton"] = true
