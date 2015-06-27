exports = module.exports = ->
  controller: require "./controller"
  link: require "./link"
  scope:
    ngDisabled: "="
    type: "="
  require: "ngModel"
  templateUrl: "components/form-ui/input-keywords/template"
