exports = module.exports = ->
  scope:
    options: "=options"
    placeholder: "=placeholder"
    fieldType: "=type"
    value: "=model"
  controller: require "./controller"
  templateUrl: "components/forms/input/template"
