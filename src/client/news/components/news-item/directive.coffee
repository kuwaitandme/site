exports = module.exports = ->
  controller: require "./controller"
  require: "ngModel"
  link: require "./link"
  scope: true
  templateUrl: "news/components/item/template"
