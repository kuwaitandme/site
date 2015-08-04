exports = module.exports = ->
  controller: require "./controller"
  link: require "./link"
  scope: true
  require: "ngModel"
  templateUrl: "common/components/form-ui/input-category/template"
