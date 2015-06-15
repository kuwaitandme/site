watch = require "gulp-watch"

module.exports = (gulp, config) -> ->
  gulp.watch config.cssPattern, ["sass", "md5", "checksum"]
  gulp.watch config.jadePattern, ["jade", "md5", "checksum"]
  gulp.watch config.jsPattern, ["coffee", "md5", "checksum"]
  gulp.watch config.serverPattern, ["server"]
