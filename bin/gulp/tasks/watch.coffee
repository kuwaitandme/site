watch = require 'gulp-watch'

module.exports = (gulp, config) ->
  gulp.task 'watch', ->
    gulp.watch config.jsPattern,  ['js']
    gulp.watch config.cssPattern, ['css']
    gulp.watch config.jadePattern, ['html']