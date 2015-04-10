module.exports =
  get: (request, response, next) -> response.redirect '/guest/post'

  post:   require './post'
  single: require './single'
  edit:   require './edit'
  finish: require './finish'

  routes: (router, base) ->
    router.get base + '/guest/',              @get
    router.get base + '/guest/post',          @post.get
    router.get base + '/guest/finish/:id?',   @finish.get
    router.get base + '/guest/:id?',          @single.get
    router.get base + '/guest/:id/edit',      @finish.get