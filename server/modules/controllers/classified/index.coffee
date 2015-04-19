module.exports =
  get: (request, response, next) -> response.redirect "/guest/post"

  post:   require "./post"
  finish: require "./finish"
  search: require "./search"
  single: require "./single"
  edit:   require "./edit"

  routes: (router, localizedUrl) ->
    # router.get (localizedUrl "/classified/"),                    @get
    router.get (localizedUrl "/classified/post"),                  @post.get
    router.get (localizedUrl "/classified/"),                      @search.get
    router.get (localizedUrl "/classified/([a-z\-]*)"),            @search.get
    router.get (localizedUrl "/classified/([a-z\-]*)/([a-z\-]*)"), @search.get
    router.get (localizedUrl "/classified/([a-zf0-9]*)/finish"),   @finish.get
    router.get (localizedUrl "/classified/([a-zf0-9]*)/edit"),     @edit.get
    router.get (localizedUrl "/classified/([a-zf0-9]*)"),          @single.get