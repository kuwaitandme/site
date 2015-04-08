emailReport = require './emailReport'
clearCache  = require './clearCache'
expireClassifieds = require './expireClassifieds'
deleteBadUsers = require './deleteBadUsers'

module.exports = (cron) ->
  emailReport()
  cronDaily = ->
    # if global.config.mode is 'production'
    deleteBadUsers()

  cronHourly = ->
    clearCache()
    # depromoteClassifieds()
    expireClassifieds()

  # setup the cron tasks
  new cron '0 0 0 * * *', cronDaily,  null, true, 'Asia/Kuwait'
  new cron '0 0 * * * *', cronHourly, null, true, 'Asia/Kuwait'