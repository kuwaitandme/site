exports = module.exports = ->
  require: "ngModel"
  scope: true
  link: require "./link"
  templateUrl: "common/components/form-ui/input-textarea/template"
