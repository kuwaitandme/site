exports = module.exports = ->
  link: require "./link"
  controller: require "./controller"
  scope: list: "="
  require: "ngModel"
  templateUrl: "common/components/form-ui/input-list/template"
