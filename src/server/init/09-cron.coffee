cronJob        = (require "cron").CronJob

exports = module.exports = (IoC, settings,
    clearCache,
    emailReport,
    deleteBadUsers,
    expireClassifieds,
    rotateLogfiles,
    backupDatabase
  ) ->
  logger = IoC.create "igloo/logger"

  # Runs every day at 9PM
  cronDaily = ->
    logger.info "running daily cron scripts"
    if settings.environment is "production" then emailReport()
    # deleteBadUsers()
    # expireClassifieds()
    # rotateLogfiles()


  # Run at the start of every hour
  cronHourly = ->
    logger.info "running hourly cron scripts"
    clearCache()
    # depromoteClassifieds()


  # Runs every Friday at 1AM
  cronWeekly = ->
    logger.info "running daily cron scripts"
    # backupDatabase()

  # setup the cron tasks
  new cronJob "0  0  *  *  *  *", cronHourly, null, true, "Asia/Kuwait"
  new cronJob "0  0  1  *  *  5", cronWeekly, null, true, "Asia/Kuwait"
  new cronJob "0  0  21 *  *  *", cronDaily,  null, true, "Asia/Kuwait"


exports["@require"] = [
  "$container"
  "igloo/settings"
  "cron/clearCache"
  "cron/emailReport"
  "cron/deleteBadUsers"
  "cron/expireClassifieds"
  "cron/rotateLogfiles"
  "cron/backupDatabase"
]
exports["@singleton"] = true