path     = require "path"
walk     = require "fs-walk"


app = "http://development.kuwaitandme.com"

name = "[test]"
testPaths = []
testFilename = "test.coffee"

walkPath = path.join __dirname, "."
console.log name, "walking on src directory"

# Now start walking and look for the test files
walk.walkSync walkPath, (basedir, filename, stat) ->
  if filename is testFilename then testPaths.push "#{basedir}/#{filename}"

console.log name, "grabbed #{testPaths.length} test file(s)"

for test in testPaths
  fn = require test
  fn app

console.log name, "finished tests"
