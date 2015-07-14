###
Entry point
===========
Entry point for the server-side. INCOMPLETE

Steven Enamakel <me@steven.pw>
###

IoC      = require "electrolyte"
bootable = require "bootable"
express  = require "express"
igloo    = require "igloo"
path     = require "path"


# A helper function to properly resolve paths
_path = (newpath) -> path.join __dirname, newpath


# Start loading the different dependencies
IoC.loader                IoC.node _path "../../etc/config"
IoC.loader "controllers", IoC.node _path "controllers"
IoC.loader "cron",        IoC.node _path "cron"
IoC.loader "igloo",       igloo
IoC.loader "models",      IoC.node _path "models"


###
  At this point, electrolyte will have scanned all our source code and created
  proper dependency maps. So to understand how control now goes, follow the
  `app.phase` lines below.

  NOTE: If you don't understand how bootable or bootable.di.initializer works
  then I recommend reading their source codes on github.

  At first all scripts in "init/pre" are executed and then the app is
  initialized by igloo (using "igloo/server"). When the app is set, it is now
  listening to the routes that we have defined and will start executing based
  on which ones get fired. We also keep some scripts in "init/post" if we need
  to run anything after the app has been set.

  Also note that the app doesn't really start in this file. It's boot-order is
  just defined here. To really start the app you need to call `app.boot()`
  which is done in the bin/server.coffee file.
###


# Use bootable to create our app.
app = bootable express()

# Run scripts that have to be run before initializing.
app.phase bootable.di.initializers _path "init/pre"

# Now initialize the app.
app.phase bootable.di.routes _path "routes"
app.phase IoC.create "igloo/server"

# Run scripts that have to be run after initializing.
app.phase bootable.di.initializers _path "init/post"

# Hand over our app to whoever wants it. They must start the app using
# app.boot().
module.exports = app
