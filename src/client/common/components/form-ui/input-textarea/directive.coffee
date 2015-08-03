exports = module.exports = ->
  require: "ngModel"
  scope: true
  link: require "./link"
  templateUrl: "components/form-ui/input-textarea/template"
