backupDatabase     = require './backupDatabase'
clearCache         = require './clearCache'
deleteBadUsers     = require './deleteBadUsers'
emailReport        = require './emailReport'
expireClassifieds  = require './expireClassifieds'
rotateLogfiles     = require './logrotate'

module.exports = (cron) ->

  # Runs every day at 9PM
  cronDaily = ->
    if global.config.mode is 'production'
      emailReport()
    deleteBadUsers()
    expireClassifieds()
    rotateLogfiles()


  # Run at the start of every hour
  cronHourly = ->
    clearCache()
    # depromoteClassifieds()


  # Runs every Friday at 1AM
  cronWeekly = ->
    backupDatabase()


  # setup the cron tasks
  new cron '0  0  *  *  *  *', cronHourly, null, true, 'Asia/Kuwait'
  new cron '0  0  1  *  *  5', cronWeekly, null, true, 'Asia/Kuwait'
  new cron '0  0  21 *  *  *', cronDaily,  null, true, 'Asia/Kuwait'