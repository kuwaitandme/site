console.log "[masonry] initializing"

module = angular.module "Masonry", []
module.factory "Masonry", ["$window", ($window) -> $window.Masonry ]