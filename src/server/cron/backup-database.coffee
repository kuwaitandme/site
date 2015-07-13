Promise = require "bluebird"
exec = (require "child_process").exec
path = require "path"
zpad = require "zpad"


exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"
  name = "[cron:backup-database]"


  ###
    This function simply wraps our exec function inside a Promise
  ###
  execPromise = (cmd) -> new Promise (resolve, reject) ->
    exec cmd, (error, stdout, stderr) ->
      if error
        logger.error stderr
        reject error
      else resolve stdout


  ###
    Helper function to create the timestamp.
  ###
  createTimestamp = ->
    date = new Date
    month = zpad date.getMonth() + 1
    year = zpad date.getFullYear()
    day = zpad date.getDate()
    "#{month}-#{day}-#{year}"


  ###
    Runs a postgres command to perform a SQL dump. For this function to run
    properly, the password used to authenticate during the dump must be
    saved in the ~/.pgpass file.

    See http://www.postgresql.org/docs/current/static/libpq-pgpass.html
    and http://www.postgresql.org/docs/8.1/static/backup.html
  ###
  doBackup = ->
    logger.info name, "running"
    config = settings.knex.connection
    timestamp = createTimestamp()
    destination = "#{settings.backupDir}/db-#{timestamp}.gz"

    cmd = "pg_dump -d #{config.database} -U #{config.user} |
      gzip > #{destination}"

    execPromise(cmd).then -> destination


  job = ->
    doBackup().then (dest) -> logger.info name, "created backup file in #{dest}"
    .catch (error) -> logger.error name, "backup failed"


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
