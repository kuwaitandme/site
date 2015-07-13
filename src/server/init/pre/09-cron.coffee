cronJob        = (require "cron").CronJob


exports = module.exports = (IoC, settings) ->
  name = "[cron]"
    # clearCache,
    # emailReport,
    # deleteBadUsers,
    # expireClassifieds,
    # rotateLogfiles,
  logger = IoC.create "igloo/logger"

  backupDatabase = IoC.create "cron/backupDatabase"
  clearCache = IoC.create "cron/clearCache"

  # Runs every day at 9PM
  cronDaily = ->
    logger.info name, "running daily cron scripts"
    if settings.server.env == "production" then emailReport()
    # deleteBadUsers()
    # expireClassifieds()
    # rotateLogfiles()


  # Run at the start of every hour
  cronHourly = ->
    logger.info name, "running hourly cron scripts"
    clearCache()


  # Runs every Friday at 1AM
  cronWeekly = ->
    logger.info name, "running daily cron scripts"
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
