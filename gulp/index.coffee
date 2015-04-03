gulp   = require 'gulp'
config = require './config'

module.exports = (tasks) ->
  for taskname in tasks
    # Get each task
    task = require "./tasks/#{taskname}"

    # Register each generated task with the taskname
    task gulp, (config[taskname] or {})

  gulp