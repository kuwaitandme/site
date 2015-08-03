exports = module.exports = ->
  link: require "./link"
  scope: true
  require: "ngModel"
  controller: require "./controller"
  replace: true
