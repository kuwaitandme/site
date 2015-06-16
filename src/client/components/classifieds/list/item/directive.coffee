exports = module.exports = ->
  controller: require "./controller"
  link: require "./link"
  require: "ngModel"
  scope: true
  templateUrl: "components/classifieds/list/item/template"
