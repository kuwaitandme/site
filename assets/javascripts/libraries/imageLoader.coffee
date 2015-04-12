# http://web.archive.org/web/20120904060007/http://lucassmith.name/2008/11/is-my-image-loaded.html

###
Here's the meat and potatoes. Usage

  imageLoader('imgId',{
      success : function () { alert(this.width); },
      failure : function () { alert('Damn your eyes!'); },
  });

  imageLoader('http://somedomain.com/image/typooed_url.jpg', {
      success : function () {...},
      failure : function () {...},
      target : jQuery DOM,
  });
###
module.exports = (src, cfg) ->
  # First a couple helper functions
  $ = (id) -> if !id or id.nodeType == 1 then id else document.getElementById id
  isType = (o, t) -> (typeof o).indexOf(t.charAt(0).toLowerCase()) == 0

  cfg = cfg or (if isType src, 'o' then src else {})

  img = document.createElement 'img'
  src = src or cfg.src

  if not src then throw 'Image source not found'

  prop = if isType img.naturalWidth, 'u' then 'width' else 'naturalWidth'
  img.alt = cfg.alt or img.alt

  # Add the image and insert if requested (must be on DOM to load or
  # pull from cache)
  img.src = src
  if cfg.target then cfg.target.append img

  # Loaded?
  if img.complete
    if img[prop]
      if isType cfg.success, 'f'
        cfg.success.call img
    else
      if isType cfg.failure, 'f'
        cfg.failure.call img
  else
    if isType cfg.success, 'f' then img.onload = cfg.success
    if isType cfg.failure, 'f' then img.onerror = cfg.failure
  img