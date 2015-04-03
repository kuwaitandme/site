expect           = require 'expect.js'
supertest        = require 'supertest'


app = global.app

checkRouteFor = (code, route) ->
  it "GET #{code} #{route}", (done) ->
    supertest(app).get(route).expect(code, done)

describe 'routes (non-api)', ->
  describe 'check if routes are accessible (without authentication)', ->
    checkRouteFor 200, '/'
    checkRouteFor 200, '/auth/forgot'
    checkRouteFor 200, '/auth/login'
    checkRouteFor 200, '/auth/signup'
    checkRouteFor 200, '/classified/search'
    checkRouteFor 200, '/guest/post'
    checkRouteFor 200, '/terms'
    checkRouteFor 200, '/privacy'


    describe 'routes that need authentication should redirect', ->
      checkRouteFor 302, '/account/manage'
      checkRouteFor 302, '/account/profile'
      checkRouteFor 302, '/classified/post'

    describe 'blank routes should redirect to default ones', ->
      checkRouteFor 302, '/account'
      checkRouteFor 302, '/auth/'
      checkRouteFor 302, '/auth/logout'
      checkRouteFor 302, '/classified/'
      checkRouteFor 302, '/guest/'

    describe 'routes with missing parameters should return 404', ->
      checkRouteFor 404, '/i-dont-exist'
      checkRouteFor 404, '/classified/single'
      checkRouteFor 404, '/guest/single'

  describe 'check if routes are accessible (with authentication)', ->
