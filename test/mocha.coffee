mongoose = require 'mongoose'
config   = require '../var/config.coffee'
models   = require '../server/models'


# Setup some globals
global.config = config
global.models = models
global.controllers = null


# Open up a DB connection to run our queries on
mongoose.connect 'mongodb://' + config.mongodb.username + ':' +
	config.mongodb.password + '@localhost/kuwaitandme'


require './mocha/models'