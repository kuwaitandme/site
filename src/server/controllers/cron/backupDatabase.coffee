exec = (require "child_process").exec
path = require "path"
util = require "util"

module.exports = ->

  backupPath = path.normalize "#{global.root}/../var/backups"

  doCompression = (backupSource) ->
    console.log "compressing backup file"

    _twodigits = (number) -> "0#{number}".slice -2
    date = new Date
    month = _twodigits date.getMonth() + 1
    year = date.getFullYear()
    day = _twodigits date.getDate()

    timestamp = "#{day}-#{month}-#{year}"
    backupDestination = path.normalize "#{global.root}/../var/backups/#{timestamp}.tgz"

    cmd = "tar -zcvf #{backupDestination} #{backupSource}"
    exec cmd, (error, stdout, stderr) ->


  doBackup = (tempDirectory) ->
    console.log "performing mongodb backup"
    console.log "using temporary directory", tempDirectory

    config = global.config.mongodb
    cmd = "mongodump -d #{config.database} -u #{config.username} -p
      #{config.password} -o #{tempDirectory}"

    exec cmd, (error, stdout, stderr) -> doCompression tempDirectory


  exec "mktemp -d", (error, stdout, stderr) ->
    # TODO: Handle error here
    tempDirectory = (path.normalize stdout).split("\n")[0]
    doBackup tempDirectory