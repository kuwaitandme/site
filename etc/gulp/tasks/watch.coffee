runSequence = require "run-sequence"
watch       = require "gulp-watch"

module.exports = (gulp, config) -> ->
  sequence = runSequence.use gulp

  gulp.task "watch:coffee", -> sequence "coffee", "md5", "checksum"
  gulp.task "watch:jade", -> sequence "jade", "md5", "checksum"
  gulp.task "watch:sass", -> sequence "sass", "md5", "checksum"

  gulp.watch config.coffeePattern, ["watch:coffee"]
  gulp.watch config.jadePattern, ["watch:jade"]
  gulp.watch config.sassPattern, ["watch:sass"]
  gulp.watch config.serverPattern, ["server"]
