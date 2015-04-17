i18n               = require 'i18n'

module.exports = (app) ->
  i18n.configure
    cookie: 'l'
    defaultLocale: 'en'
    directory: "#{global.root}/modules/i18n"
    locales: [ 'en', 'ar', 'dg']

  global.__ = i18n.__
  app.use i18n.init