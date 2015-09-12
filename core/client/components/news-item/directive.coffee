module.exports = Directive = ->
  controller: require "./controller"
  require: "ngModel"
  link: require "./link"
  scope: true
  templateUrl: "components/sharing-item/template"