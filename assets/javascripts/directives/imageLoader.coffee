module.exports = ->
  link = (scope, elm, attr) ->
    isType = (o, t) -> (typeof o).indexOf(t.charAt(0).toLowerCase()) == 0
    img = elm[0]
    src = attr.imageLoader

    elm.addClass 'image-loading'
    success = ->
      elm.removeClass 'image-loading'
      elm.addClass 'image-success'
      fn = (scope.imageSuccess and scope.imageSuccess()) or ->
      fn()
    failure = ->
      elm.removeClass 'image-loading'
      elm.addClass 'image-fail'
      fn = (scope.imageFail and scope.imageFail()) or ->
      fn()

    prop = if isType img.naturalWidth, 'u' then 'width' else 'naturalWidth'
    img.src = src
    if img.complete
      if img[prop] then success img
      else failure img
    else
      img.onload = success
      img.onerror = failure

  scope:
    imageSuccess: "&"
    imageFail: "&"
  link: ['scope', 'element', 'attributes', link]