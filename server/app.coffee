IoC      = require 'electrolyte'
bootable = require 'bootable'
express  = require 'express'
path     = require 'path'
igloo    = require 'igloo'

# change the working directory to the root directory
# process.chdir __dirname

# dependency injection
IoC.loader                IoC.node path.join __dirname, '../etc/config'
IoC.loader 'igloo',       igloo
IoC.loader 'controllers', IoC.node path.join __dirname, 'controllers'
IoC.loader 'models',      IoC.node path.join __dirname, 'models'

app = bootable express()

# removing this since it seems we still get errors
# <https://github.com/yeoman/update-notifier/issues/25#issuecomment-52824043>
#app.phase(IoC.create('igloo/update-notifier'))

app.phase bootable.di.initializers()
app.phase bootable.di.routes path.join __dirname, 'routes'
app.phase IoC.create 'igloo/server'

module.exports = app