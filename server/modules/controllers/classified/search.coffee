getQueryParameters = (require '../../api/query/helpers').getQueryParameters

# Controller for the classified search page. Searches for classifieds with
# some search parameters passed on as GET variables.
controller = module.exports =
  get: (request, response, next) ->
    parameters = getQueryParameters request
    page = 1
    reverse = false

    classified = global.models.classified
    classified.search parameters, page, reverse, (error, classifieds) ->
      if error then return next error

      args =
        data: classifieds: classifieds
        page: 'classified/search'
        title: response.__ 'title.classified.search'

      render = global.modules.renderer
      render request, response, args