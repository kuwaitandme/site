###*
 * This file is main entry file for unit-testing the App's server-side. Unlike
 * normal convention of having a 'test' folder in the root directory, we prefer
 * to have '*test.coffee' files all across the src of the App. This way we keep
 * each test file right next to it's source code and this makes it much easier
 * for when the App grows large-scale.
 *
 * The code below walks through all the files in the source tree and grabs all
 * the files that match the "*test.coffee" expression. It then requires it and
 * calls it with the 'app' variable (see below).
 *
 * This configuration also allows us to have nice filenames like
 * 'get.test.coffee', 'put.test.coffee', 'part1.test.coffee' etc ...
 *
 * @author Steven Enamakel <me@steven.pw>
###
path     = require "path"
walk     = require "fs-walk"


# Setup some defaults..
app = "http://development.kuwaitandme.com"
name = "[test]"
testPaths = []
testFilename = "test.coffee"

walkPath = path.join __dirname, "."
console.log name, "walking on src directory"


# Start walking and look for the test files
walk.walkSync walkPath, (basedir, filename, stat) ->
  # Now this condition ensures that any file which contains the 'test.coffee'
  # string in its filename gets included in our list of tests to run.
  if filename.indexOf(testFilename) > -1
    console.log name, "grabbing #{file}"

    file = "#{basedir}/#{filename}"
    testPaths.push file


# Now require each of the tests and pass the app to it..
console.log name, "grabbed #{testPaths.length} test file(s)"
console.log name, "running mocha on each test"
fn = (require test) app for test in testPaths
