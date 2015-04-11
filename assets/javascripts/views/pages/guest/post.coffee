module.exports = (require '../classified/post').extend
  name: '[view:guest-post]'
  templateOptions:
    isGuest: true
    hasClassified: false

  checkRedirect: -> false