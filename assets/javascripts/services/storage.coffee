module.exports = ->
  savedData: {}
  set: (key="", value) -> @savedData[key] = value
  get: (key)           -> @savedData[key]
  clear: (key)         -> @savedData = {}