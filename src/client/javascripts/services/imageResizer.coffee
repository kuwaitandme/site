module.exports = ->

  ###
  This function creates the thumbnail from the given file with the given
  options. The options will have three arguments:
    thumbnailWidth: Target width for thumbnail
    thumbnailHeight: Target height for thumbnail
    callback: A callback function which receives the imageData of the new
    thumbnail.
  ###
  createThumbnail: (file, options={}) ->
    fileReader = new FileReader
    fileReader.onload = =>
      # Don't bother creating a thumbnail for SVG images since they're vector
      if file.type == "image/svg+xml"
        options.callback fileReader.result if options.callback?
        return
      @createThumbnailFromUrl file, fileReader.result, options

    # Start reading the file
    fileReader.readAsDataURL file


  createThumbnailFromUrl: (file, imageUrl, options) ->
    img = document.createElement "img"
    img.onload = =>
      file.width = img.width
      file.height = img.height

      resizeInfo = @resize file, options
      resizeInfo.trgWidth ?= resizeInfo.optWidth
      resizeInfo.trgHeight ?= resizeInfo.optHeight

      canvas = document.createElement "canvas"
      ctx = canvas.getContext "2d"
      canvas.width = resizeInfo.trgWidth
      canvas.height = resizeInfo.trgHeight

      # This is a bugfix for iOS' scaling bug.
      @drawImageIOSFix ctx, img, resizeInfo.srcX ? 0, resizeInfo.srcY ? 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX ? 0, resizeInfo.trgY ? 0, resizeInfo.trgWidth, resizeInfo.trgHeight

      thumbnail = canvas.toDataURL "image/png"
      @thumbnailCreated file, thumbnail
      options.callback thumbnail if options.callback?

    img.onerror = callback if callback?
    img.src = imageUrl


  # Called when a thumbnail has been generated
  # Receives `file` and `dataUrl`
  thumbnailCreated: (file, dataUrl) ->
    if file.previewElement
      file.previewElement.classList.remove "dz-file-preview"
      for thumbnailElement in file.previewElement.querySelectorAll("[data-dz-thumbnail]")
        thumbnailElement.alt = file.name
        thumbnailElement.src = dataUrl

      setTimeout (=> file.previewElement.classList.add "dz-image-preview"), 1


  # Gets called to calculate the thumbnail dimensions.
  #
  # You can use file.width, file.height, options.thumbnailWidth and
  # options.thumbnailHeight to calculate the dimensions.
  #
  # The dimensions are going to be used like this:
  #
  #     var info = @options.resize.call(this, file);
  #     ctx.drawImage(img, info.srcX, info.srcY, info.srcWidth, info.srcHeight, info.trgX, info.trgY, info.trgWidth, info.trgHeight);
  #
  #  srcX, srcy, trgX and trgY can be omitted (in which case 0 is assumed).
  #  trgWidth and trgHeight can be omitted (in which case the options.thumbnailWidth / options.thumbnailHeight are used)
  resize: (file, options) ->
    info =
      srcX: 0
      srcY: 0
      srcWidth: file.width
      srcHeight: file.height

    srcRatio = file.width / file.height

    info.optWidth = options.thumbnailWidth or 300
    info.optHeight = options.thumbnailHeight or 300

    # automatically calculate dimensions if not specified
    if not info.optWidth? and not info.optHeight?
      info.optWidth = info.srcWidth
      info.optHeight = info.srcHeight
    else if not info.optWidth?
      info.optWidth = srcRatio * info.optHeight
    else if not info.optHeight?
      info.optHeight = (1/srcRatio) * info.optWidth

    trgRatio = info.optWidth / info.optHeight

    if file.height < info.optHeight or file.width < info.optWidth
      # This image is smaller than the canvas
      info.trgHeight = info.srcHeight
      info.trgWidth = info.srcWidth

    else
      # Image is bigger and needs rescaling
      if srcRatio > trgRatio
        info.srcHeight = file.height
        info.srcWidth = info.srcHeight * trgRatio
      else
        info.srcWidth = file.width
        info.srcHeight = info.srcWidth / trgRatio

    info.srcX = (file.width - info.srcWidth) / 2
    info.srcY = (file.height - info.srcHeight) / 2
    info


  # Detecting vertical squash in loaded image.
  # Fixes a bug which squash image vertically while drawing into canvas for some images.
  # This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
  detectVerticalSquash: (img) ->
    iw = img.naturalWidth
    ih = img.naturalHeight

    canvas = document.createElement "canvas"
    canvas.width = 1
    canvas.height = ih
    ctx = canvas.getContext "2d"
    ctx.drawImage img, 0, 0
    data = (ctx.getImageData 0, 0, 1, ih).data


    # search image edge pixel position in case it is squashed vertically.
    sy = 0
    ey = ih
    py = ih
    while py > sy
      alpha = data[(py - 1) * 4 + 3]

      if alpha is 0 then ey = py else sy = py

      py = (ey + sy) >> 1
    ratio = py / ih

    if (ratio is 0) then 1 else ratio


  # A replacement for context.drawImage
  # (args are for source and destination).
  drawImageIOSFix: (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) ->
    vertSquashRatio = @detectVerticalSquash img
    ctx.drawImage img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio