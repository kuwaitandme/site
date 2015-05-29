IoC      = require "electrolyte"
bootable = require "bootable"
express  = require "express"
igloo    = require "igloo"
path     = require "path"

_path = (newpath) -> path.join __dirname, newpath

# dependency injection
IoC.loader                IoC.node _path "../../etc/config"
IoC.loader "controllers", IoC.node _path "controllers"
IoC.loader "cron",        IoC.node _path "cron"
IoC.loader "igloo",       igloo
IoC.loader "models",      IoC.node _path "models"

app = bootable express()

app.phase bootable.di.initializers _path "init"
app.phase bootable.di.routes       _path "routes"
app.phase IoC.create "igloo/server"

module.exports = app