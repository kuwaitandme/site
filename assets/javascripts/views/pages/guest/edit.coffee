module.exports = (require '../classified/edit').extend
  name: '[view:guest-edit]'
  templateOptions:
    isGuest: true
    hasClassified: true

  checkRedirect: -> false