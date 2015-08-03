exports = module.exports = ->
  link: require "./link"
  controller: require "./controller"
  scope: list: "="
  require: "ngModel"
  templateUrl: "components/form-ui/input-long-list/template"
