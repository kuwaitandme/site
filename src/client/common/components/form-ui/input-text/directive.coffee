exports = module.exports = ->
  link: require "./link"
  scope:
    ngDisabled: "="
    type: "="
  require: "ngModel"
  templateUrl: "components/form-ui/input-text/template"
