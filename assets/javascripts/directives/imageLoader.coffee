module.exports = ->
  scope:
    imageSuccess: "&"
    imageFail: "&"


  link: (scope, element, attributes) ->
    isType = (o, t) -> (typeof o).indexOf(t.charAt(0).toLowerCase()) == 0
    img = element[0]
    src = attributes.imageLoader
    element.addClass "image-loading"

    success = ->
      element.removeClass "image-loading"
      element.addClass "image-success"
      fn = (scope.imageSuccess and scope.imageSuccess()) or ->
      fn()
    failure = ->
      element.removeClass "image-loading"
      element.addClass "image-fail"
      fn = (scope.imageFail and scope.imageFail()) or ->
      fn()

    prop = if isType img.naturalWidth, "u" then "width" else "naturalWidth"
    img.src = src
    if img.complete
      if img[prop] then success img
      else failure img
    else
      img.onload = success
      img.onerror = failure