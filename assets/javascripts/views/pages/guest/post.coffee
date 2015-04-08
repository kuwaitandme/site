view   = require '../classified/post'

module.exports = view.extend
  templateOptions:
    isGuest: true
    hasClassified: false