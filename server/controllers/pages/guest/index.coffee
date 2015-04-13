module.exports =
  post:   require './post'
  single: require './single'
  edit:   require './edit'
  finish: require './finish'

  routes: (router, localizedUrl) ->
    router.get (localizedUrl "/guest/post"),                @post.get
    router.get (localizedUrl "/guest/([a-zf0-9]*)/finish"), @finish.get
    router.get (localizedUrl "/guest/([a-zf0-9]*)/edit"),   @edit.get
    router.get (localizedUrl "/guest/([a-zf0-9]*)"),        @single.get