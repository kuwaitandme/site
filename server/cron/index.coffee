clearCache         = require './clearCache'
deleteBadUsers     = require './deleteBadUsers'
emailReport        = require './emailReport'
expireClassifieds  = require './expireClassifieds'


module.exports = (cron) ->
  cronDaily = ->
    if global.config.mode is 'production'
      emailReport()
    deleteBadUsers()

  cronHourly = ->
    clearCache()
    # depromoteClassifieds()
    expireClassifieds()

  # setup the cron tasks
  new cron '0 0 21 * * *', cronDaily,  null, true, 'Asia/Kuwait'
  new cron '0 0 *  * * *', cronHourly, null, true, 'Asia/Kuwait'