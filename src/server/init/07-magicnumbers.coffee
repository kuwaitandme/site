async   = require "async"
fs      = require "fs"
md5     = require "MD5"
md5File = require "md5-file"

exports = module.exports = (IoC, settings, cache) ->
  logger = IoC.create "igloo/logger"
  logger.debug "[init] starting magicnumbers listeners"

  publicDir = settings.publicDir
  modelsDir = settings.modelsDir
  name = "[magicnumbers]"

  checksumFile = "#{publicDir}/build/checksums"

  # This function reads and updates the md5 sums from the checksum file.
  readChecksums = ->
    logger.log name, "reading checksums"
    md5sums = {}

    # Start reading the checksums file and save them into a local variable
    text = (fs.readFileSync checksumFile).toString()
    lines = text.split "\n"
    for line in lines
      words = line.split "  "
      filename = words[1]
      sum = words[0]
      if filename
        md5sums[filename] = sum
        logger.debug name, "MD5 #{sum} = #{filename}"

    # Now that we have the sums, we now update the settings and clear the cache.
    settings.magic = md5sums
    cache.clear()


  # We ask for node to re-calculate the checksums in case if there needs to be
  # any updating that is done on-the-go..
  try fs.watch checksumFile, readChecksums
  catch e then console.log e

  # Finally, read the checksums for the first time.
  readChecksums()

exports["@require"] = [
  "$container"
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true
