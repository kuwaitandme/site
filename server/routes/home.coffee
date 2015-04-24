# # routes - home
exports = module.exports = (IoC) ->
  app = this
  app.get '/', IoC.create 'controllers/main/landing'

exports['@require'] = [ '$container' ]
exports['@singleton'] = true