cronJob        = (require 'cron').CronJob

module.exports = modules =
  api:         require './api'
  controllers: require './controllers'
  cron:        require './cron'
  email:       require './email'
  i18n:        require './i18n'
  magicnumbers:require './magicnumbers'
  logger:      require './logger'
  passport:    require './passport'
  recaptcha:   require './recaptcha'
  renderer:    require './renderer'
  router:      require './router'
  twocheckout: require './twocheckout'
  uploader:    require './uploader'

  initialize: (app) ->
    # International language support
    initializei18n = modules.i18n
    initializei18n app

    # Initialize Passport User authentication
    initPassport = modules.passport
    initPassport app

    # Setup the different routes
    initializeRouter = modules.router
    initializeRouter app

    # Start the cron jobs
    cronInitialize = modules.cron
    cronInitialize cronJob

    # Initialize the magic numbers that will change based on any frontend
    # changes IMPOROVE THIS
    magicnumbersInitialize = modules.magicnumbers
    magicnumbersInitialize app