bootloader = require "../bootloader"

bootloader.initialize()
app = angular.module "app.news", ["app.common"]

# Add each of the angular components
(require "./components")    app
(require "./models")        app
(require "./views")         app

# Add the router
app.config require "./router"
bootloader.start "app.news"
