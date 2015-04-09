view   = require '../classified/post'

module.exports = view.extend
  name: '[view:guest-post]'
  templateOptions:
    isGuest: true
    hasClassified: false

  checkRedirect: -> false