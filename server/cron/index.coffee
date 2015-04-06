emailReport = require './emailReport'
clearCache  = require './clearCache'

module.exports = (cron) ->
  cronDaily = ->
    if global.config.mode is 'production'
      emailReport()

  cronHourly = ->
      clearCache()
      # depromoteClassifieds()
      # expireClassifieds()

  # setup the cron tasks
  new cron '0 0 0 * * *', cronDaily,  null, true, 'Asia/Kuwait'
  new cron '0 0 * * * *', cronHourly, null, true, 'Asia/Kuwait'