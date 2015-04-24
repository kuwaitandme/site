fs     = require "fs"
rotate = require "log-rotate"

module.exports = ->
  # Rotate logfile at every 1M
  logfileSizeLimit = 1000000

  # Setup logrotate options
  logrotateOptions = compress: true

  logfiles = global.config.logfiles
  for logfile of logfiles
    try
      file = "#{global.root}/../#{logfiles[logfile]}"
      filestats = fs.statSync file

      filesize = filestats["size"]
      if filesize >= logfileSizeLimit then rotate file, logrotateOptions, ->

    # You will land here if the file is not found
    catch error