IoC      = require "electrolyte"
bootable = require "bootable"
express  = require "express"
igloo    = require "igloo"
path     = require "path"


# A helper function to properly resolve paths
_path = (newpath) -> path.join __dirname, newpath


# Start injecting the different dependencies
IoC.loader                IoC.node _path "../../etc/config"
IoC.loader "controllers", IoC.node _path "controllers"
IoC.loader "cron",        IoC.node _path "cron"
IoC.loader "igloo",       igloo
IoC.loader "models",      IoC.node _path "models"

# Use bootable to create our app.
app = bootable express()

# Run the script that should run before initializing.
app.phase bootable.di.initializers _path "init/pre"

# Finally, initialized the app!
app.phase bootable.di.routes       _path "routes"
app.phase IoC.create "igloo/server"

# Run the script that should run after initializing.
app.phase bootable.di.initializers _path "init/post"


module.exports = app
