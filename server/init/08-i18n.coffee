i18n               = require 'i18n'

exports = module.exports = (IoC, settings) ->
  i18n.configure
    cookie: 'l'
    defaultLocale: 'en'
    directory: "#{settings.appDir}/locales"
    locales: [ 'en', 'ar', 'dg']
  global.__ = i18n.__

  app = this
  app.use i18n.init

exports['@require'] = [ '$container', 'igloo/settings' ]
exports['@singleton'] = true