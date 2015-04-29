config = global.config

###!
# node-recaptcha
# Copyright(c) 2010 Michael Hampton <mirhampt+github@gmail.com>
# MIT Licensed
###

###*
# Module dependencies.
###

https = require 'https'
querystring = require 'querystring'

###*
# Constants.
###

API_HOST = 'www.google.com'
API_END_POINT = '/recaptcha/api/siteverify'

###*
# Initialize Recaptcha with given `public_key`, `private_key` and optionally
# `data`.
#
# The `data` argument should have the following keys and values:
#
#   remoteip:  The IP of the client who submitted the form.
#   challenge: The value of `recaptcha_challenge_field` from the Recaptcha
#              form.
#   response:  The value of `recaptcha_response_field` from the Recaptcha
#              form.
#
# @param {String} public_key Your Recaptcha public key.
# @param {String} private_key Your Recaptcha private key.
# @param {Object} data The Recaptcha data to be verified.  See above for
#                      format.  (optional)
# @param {Boolean} secure Flag for using https connections to load client-facing things. (optional)
# @api public
###

Recaptcha =
exports.Recaptcha = (public_key, private_key, data, secure) ->
  @public_key = public_key
  @private_key = private_key
  if typeof data == 'boolean'
    @data = undefined
    @is_secure = data
  else
    @data = data
    @is_secure = secure
  this

###*
# Render the Recaptcha fields as HTML.
#
# If there was an error during `verify` and the selected Recaptcha theme
# supports it, it will be displayed.
#
# @api public
###

Recaptcha::toHTML = ->
  '<script src=\'https://www.google.com/recaptcha/api.js\' async defer></script>' + '<div class=\'g-recaptcha\' data-sitekey=\'' + @public_key + '\'></div>' + '<noscript><div style=\'width: 302px; height: 352px;\'>' + '<div style=\'width: 302px; height: 352px; position: relative;\'>' + '<div style=\'width: 302px; height: 352px; position: absolute;\'>' + '<iframe src=\'https://www.google.com/recaptcha/api/fallback?k=' + @public_key + '\'' + 'frameborder=\'0\' scrolling=\'no\'' + 'style=\'width: 302px; height:352px; border-style: none;\'></iframe></div>' + '<div style=\'width: 250px; height: 80px; position: absolute; border-style: none;' + 'bottom: 21px; left: 25px; margin: 0px; padding: 0px; right: 25px;\'>' + '<textarea id=\'g-recaptcha-response\' name=\'g-recaptcha-response\'' + 'class=\'g-recaptcha-response\' style=\'width: 250px; height: 80px; border: 1px solid #c1c1c1; ' + 'margin: 0px; padding: 0px; resize: none;\' value=\'\'></textarea></div></div></div></noscript>'

###*
# Verify the Recaptcha response.
#
# Example usage:
#
#     var recaptcha = new Recaptcha('PUBLIC_KEY', 'PRIVATE_KEY', data);
#     recaptcha.verify(function(success, error_code) {
#         if (success) {
#             // data was valid.  Continue onward.
#         }
#         else {
#             // data was invalid, redisplay the form using
#             // recaptcha.toHTML().
#         }
#     });
#
# @param {Function} callback
# @api public
###

Recaptcha::verify = (callback) ->
  self = this
  # See if we can declare this invalid without even contacting Recaptcha.
  if typeof @data == 'undefined'
    @error_code = 'verify-params-incorrect'
    return callback 'verify-params-incorrect', false

  if not ('remoteip' in @data and 'response' in @data)
    @error_code = 'verify-params-incorrect'
    return callback false, 'verify-params-incorrect'

  if @data.response == ''
    @error_code = 'incorrect-captcha-sol'
    return callback 'incorrect-captcha-sol', false

  # Add the private_key to the request.
  @data['secret'] = @private_key
  data_qs = querystring.stringify @data
  req_options =
    host: API_HOST
    path: API_END_POINT
    port: 443
    method: 'POST'
    headers:
      'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Length': data_qs.length

  request = https.request req_options, (response) ->
    body = ''
    response.on 'error', (err) ->
      self.error_code = 'recaptcha-not-reachable'
      callback 'recaptcha-not-reachable', false

    response.on 'data', (chunk) ->
      body += chunk

    response.on 'end', ->
      result = JSON.parse(body)
      callback result['error-codes'], result.success

  request.write data_qs, 'utf8'
  request.end()


exports.verify = (request, captchaSuccess, captchaFail) ->
  if config.reCaptcha.enabled == false then return captchaSuccess request

  captchaResponse = request.query.captcha or
    request.body['g-recaptcha-response'] or
    request.headers['x-gcaptcha']

  # Create the reCapthca object
  recaptcha = new Recaptcha config.reCaptcha.site, config.reCaptcha.secret,
    remoteip: request.connection.remoteAddress
    response: captchaResponse

  # Send captcha to google and create the user if successful
  recaptcha.verify (err, success) ->
    if success then captchaSuccess err, success
    else captchaFail err, success

exports['@singleton'] = true