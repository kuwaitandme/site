gulp   = require 'gulp'
config = require './config'

module.exports = (tasks) ->
  for taskname in tasks
    # Get each task
    task = (require "./tasks/#{taskname}") gulp, (config[taskname] or {})
    # Register each generated task with the taskname
    gulp.task taskname, task
  gulp
