###*
# This directive is responsible for properly loading images. It loads given
# image and calls the appropriate expression given in the 'fail' and 'success'
# attributes.
#
# This directive requires the 'src' attribute (to load the image obviously),
# and uses the expressions in 'fn-image-success' and 'fn-image-fail' to handle
# what happens when the image load succeeds or fails respectively.
###
module.exports = ->
  scope:
    fnImageSuccess: "&"
    fnImageFail: "&"

  link: (scope, element, attributes) ->
    img = element[0]

    # Check for the src attribute
    src = attributes.fnImageLoader
    if not src then throw new Error "missing src attribute"

    # Add the image-loading class, so that we can use CSS to style the image
    # as it loads..
    element.addClass "image-loading"

    # These function executes when the image has been loaded. It calls the
    # appropriate callback functions and makes sure to attach the right CSS
    # classes too.
    success = ->
      element.removeClass "image-loading"
      element.addClass "image-success"
      if attributes.fnImageSuccess then scope.fnImageSuccess()

    failure = ->
      element.removeClass "image-loading"
      element.addClass "image-fail"
      if attributes.fnImageFail then scope.fnImageFail()
      else if attributes.fnImageSuccess then scope.fnImageSuccess()

    # Now finally trigger the loading of the image. (this happens immediately
    # once we set the 'src' attribute)
    img.src = src

    # Attach the listeners for when the images loads (successfully or fails)
    if img.complete
      # This block executes if the image has already been loaded (usually from
      # the browser's cache). It explicitly calls the callback function
      isType = (o, t) -> (typeof o).indexOf(t.charAt(0).toLowerCase()) == 0
      prop = if isType img.naturalWidth, "u" then "width" else "naturalWidth"
      if img[prop] then success img
      else failure img
    else
      # This block executes when the images request has been sent and it is
      # still loading..
      img.onload = success
      img.onerror = failure
