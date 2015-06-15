watch = require "gulp-watch"

module.exports = (gulp, config) -> ->
  gulp.watch config.cssPattern, ["css"]
  gulp.watch config.jadePattern, ["html"]
  gulp.watch config.jsPattern, ["js"]
  gulp.watch config.serverPattern, ["server"]
