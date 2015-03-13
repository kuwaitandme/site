mongoose = require 'mongoose'
config   = require '../var/config.coffee'
models   = require '../server/models'
app      = require '../server/app'

# Setup some globals
global.app         = app
global.config      = config
global.controllers = null
global.models      = models


# Open up a DB connection to run our queries on
# mongoose.connect 'mongodb://' + config.mongodb.username + ':' +
# 	config.mongodb.password + '@localhost/kuwaitandme'


require './mocha/controllers'
require './mocha/models'