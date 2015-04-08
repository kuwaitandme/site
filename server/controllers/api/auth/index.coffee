module.exports =
  routes: (router, base) ->
    (require './email')       .routes router, base + '/auth'
    (require './facebook')    .routes router, base + '/auth'
    (require './google-plus') .routes router, base + '/auth'
    (require './logout')      .routes router, base + '/auth'
    (require './twitter')     .routes router, base + '/auth'
    (require './yahoo')       .routes router, base + '/auth'