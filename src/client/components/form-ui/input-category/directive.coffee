exports = module.exports = ->
  controller: require "./controller"
  link: require "./link"
  scope: true
  require: "ngModel"
  templateUrl: "components/form-ui/input-category/template"
