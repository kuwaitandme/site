exports = module.exports = ->
  require: ["^formUi"]
  # transclude: true
  scope:
    options: "=options"
    placeholder: "=placeholder"
    fieldType: "=type"
    value: "=model"
  controller: require "./controller"
  templateUrl: "components/form-ui/input-text/template"
