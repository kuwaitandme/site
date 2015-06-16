exports = module.exports = ->
  link: require "./link"
  scope: ngDisabled: "="
  require: "ngModel"
  templateUrl: "components/form-ui/input-text/template"
