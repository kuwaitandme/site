exports = module.exports = ->
  controller: require "./controller"
  link: require "./link"
  require: "ngModel"
  scope: list: "="
  templateUrl: "components/form-ui/input-images/template"
