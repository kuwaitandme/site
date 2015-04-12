module.exports =
  get: (request, response, next) -> response.redirect '/guest/post'

  post:   require './post'
  finish: require './finish'
  search: require './search'
  single: require './single'
  edit:   require './edit'

  routes: (router, base) ->
    # console.log base + '/classified/.*?$'
    router.get base + '/classified/',            @get
    router.get base + '/classified/post',        @post.get
    router.get base + '/classified/search',      @search.get
    router.get base + '/classified/finish/:id?', @finish.get
    router.get base + '/classified/:id',        @single.get
    router.get base + '/classified/:id/edit',    @edit.get