###
  This file is main entry file for unit-testing the App's server-side. Unlike
  normal convention of having a 'test' folder in the root directory, we prefer
  to have '*test.coffee' files all across the src of the App. This way we keep
  each test file right next to it's source code and this makes it much easier
  for when the App grows large-scale.

  The code below walks through all the files in the source tree and grabs all
  the files that match the "*test.coffee" expression. It then instantiates it
  with an instance of the server (the 'app' variable; see below).

  This configuration also allows us to have nice filenames like
  'get.test.coffee', 'put.test.coffee', 'part1.test.coffee' etc ... that can be
  descriptive about the test itself.

  ## Authors
  Steven Enamakel <me@steven.pw>
###

path     = require "path"
walk     = require "fs-walk"


IoC      = require "electrolyte"
express  = require "express"
igloo    = require "igloo"
path     = require "path"


# Setup some defaults..
# TODO: Fix this to use an instance. travis complains about unit tests failing.
app = "https://development.kuwaitandme.com"


# dependency injection
_path = (newpath) -> path.join __dirname, newpath
IoC.loader                IoC.node _path "../../etc/config"
IoC.loader "controllers", IoC.node _path "controllers"
IoC.loader "cron",        IoC.node _path "cron"
IoC.loader "igloo",       igloo
IoC.loader "models",      IoC.node _path "models"
IoC.loader "mocha",       IoC.node _path "mocha"

logger = IoC.create "igloo/logger"


###
  Now this block of code, walks through all the sub-files and fetches out files
  that contain the 'test.coffee' string inside their filename.

  Each file that matches this condition is added and returned as an array
###
tests = do ->
  testFilename = "test.coffee"
  walkPath = path.join __dirname, "."
  logger.info "walking on '#{walkPath}' directory"
  testPaths = []

  # Start walking and look for the test files
  walk.walkSync walkPath, (basedir, filename, stat) ->
    # Now this condition ensures that any file which contains the 'test.coffee'
    # string in its filename gets included in our list of tests to run.
    if -1 < filename.indexOf testFilename
      file = path.join basedir, filename.split(".coffee")[0]
      relativePath = path.relative __dirname, file

      logger.debug "  caught #{relativePath}"
      testPaths.push relativePath

  # Now require each of the tests and pass the app to it..
  logger.info "fetched #{testPaths.length} test file(s)"
  testPaths


###
  Finally for each test file, require it! (using electrolyte) and execute it
  using the app's URL
###
for test in tests
  try (IoC.create test) app
  catch e then logger.error e
