emailReport = require './email-report'

module.exports = (cron) ->
  cronDaily = ->
    emailReport()

  # setup the daily tasks
  new cron '00 00 00 * * *', cronDaily, null, true, 'Asia/Kuwait'