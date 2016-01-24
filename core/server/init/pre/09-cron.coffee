cron = require "cron"


exports = module.exports = (IoC, settings) ->
  name = "[cron]"
  cronJob = cron.CronJob
  logger = IoC.create "igloo/logger"

  # Start initializing the different cron scripts we have..
  backupDatabase = IoC.create "cron/backup-database"
  clearCache = IoC.create "cron/clear-cache"
  # emailReport = IoC.create "cron/email-report"
  # deleteBadUsers = IoC.create "cron/delete-bad-users"
  # expireClassifieds = IoC.create "cron/expire-classifieds"
  # rotateLogfiles = IoC.create "cron/rotate-logfiles"


  ###
    This function runs daily at 9PM.
  ###
  cronDaily = ->
    logger.info name, "running daily cron scripts"
    # if settings.server.env == "production" then emailReport()


  ###
    This function runs at the start of every hour.
  ###
  cronHourly = ->
    logger.info name, "running hourly cron scripts"
    clearCache()


  ###
    This function runs every Friday at 1AM. Call maintenance functions in here.
  ###
  cronWeekly = ->
    logger.info name, "running weekly cron scripts"
    backupDatabase()


  # Setup the cron tasks
  new cronJob "0  0  *  *  *  *", cronHourly, null, true, "Asia/Kuwait"
  new cronJob "0  0  1  *  *  5", cronWeekly, null, true, "Asia/Kuwait"
  new cronJob "0  0  21 *  *  *", cronDaily,  null, true, "Asia/Kuwait"


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true