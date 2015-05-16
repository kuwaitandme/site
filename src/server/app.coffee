IoC      = require "electrolyte"
bootable = require "bootable"
express  = require "express"
igloo    = require "igloo"
path     = require "path"

# dependency injection
IoC.loader                IoC.node path.join __dirname, "../../etc/config"
IoC.loader "igloo",       igloo
IoC.loader "controllers", IoC.node path.join __dirname, "controllers"
IoC.loader "models",      IoC.node path.join __dirname, "models"
IoC.loader "cron",        IoC.node path.join __dirname, "cron"

app = bootable express()

app.phase bootable.di.initializers path.join __dirname, "init"
app.phase bootable.di.routes       path.join __dirname, "routes"
app.phase bootable.di.initializers path.join __dirname, "cron"
app.phase IoC.create "igloo/server"

module.exports = app