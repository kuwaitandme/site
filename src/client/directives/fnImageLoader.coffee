module.exports = ->
  scope:
    fnImageSuccess: "&"
    fnImageFail: "&"

  link: (scope, element, attributes) ->
    isType = (o, t) -> (typeof o).indexOf(t.charAt(0).toLowerCase()) == 0
    img = element[0]
    src = attributes.fnImageLoader
    element.addClass "image-loading"

    success = ->
      element.removeClass "image-loading"
      element.addClass "image-success"
      fn = scope.fnImageSuccess
      if fn? then fn()
    failure = ->
      element.removeClass "image-loading"
      element.addClass "image-fail"
      fn = scope.fnImageFail or scope.fnImageSuccess
      if fn? then fn()

    prop = if isType img.naturalWidth, "u" then "width" else "naturalWidth"
    img.src = src
    if img.complete
      if img[prop] then success img
      else failure img
    else
      img.onload = success
      img.onerror = failure
