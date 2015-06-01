###*
 * Copyright (c) 2010 Nick Galbreath, Steven Enamakel
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
###

###*
 * base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original specs for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
###
exports = module.exports = ($window) -> new class
  PADCHAR: "="
  ALPHA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

  makeDOMException: ->
    # sadly in FF, Safari, Chrome you can't make a DOMException
    try return new DOMException DOMException.INVALID_CHARACTER_ERR
    catch tmp
      # not available, just passback a duck-typed equiv
      # https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
      # https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
      ex = new Error "DOM Exception 5"

      # ex.number and ex.description is IE-specific.
      ex.code = ex.number = 5
      ex.name = ex.description = "INVALID_CHARACTER_ERR"

      # Safari/Chrome output format
      ex.toString = -> "Error: #{ex.name}: #{ex.message}"


  getbyte64: (s, i) ->
    # This is oddly fast, except on Chrome/V8.
    # Minimal or no improvement in performance by using a
    # object with properties mapping chars to value (eg. "A": 0)
    idx = @ALPHA.indexOf s.charAt i
    if idx == -1 then throw @makeDOMException()
    idx


  decode: (s) ->
    # convert to string
    s = "#{s}"
    imax = s.length
    if imax is 0 then return s
    if imax % 4 is not 0 then throw @makeDOMException()
    pads = 0
    if (s.charAt imax - 1) is @PADCHAR
      pads = 1
      if (s.charAt imax - 2) is @PADCHAR then pads = 2
      # either way, we want to ignore this last block
      imax -= 4
    x = []
    i = 0
    while i < imax
      b10 = (@getbyte64 s, i) << 18 | (@getbyte64 s, i + 1) << 12 |
        (@getbyte64 s, i + 2) << 6 | (@getbyte64 s, i + 3)
      x.push String.fromCharCode b10 >> 16, b10 >> 8 & 0xff, b10 & 0xff
      i += 4
    switch pads
      when 1
        b10 = (@getbyte64 s, i) << 18 | (@getbyte64 s, i + 1) << 12 |
          (@getbyte64 s, i + 2) << 6
        x.push String.fromCharCode b10 >> 16, b10 >> 8 & 0xff
      when 2
        b10 = (@getbyte64 s, i) << 18 | (@getbyte64 s, i + 1) << 12
        x.push String.fromCharCode b10 >> 16
    x.join ""


@getbyte = (s, i) ->
  x = s.charCodeAt i
  if x > 255 then throw @makeDOMException()
  x


@encode = (s) ->
  if arguments.length != 1 then throw new SyntaxError "Not enough arguments"
  x = []
  # convert to string
  s = "#{s}"
  imax = s.length - s.length % 3
  if s.length is 0 then return s
  i = 0
  while i < imax
    b10 = (@getbyte s, i) << 16 | (@getbyte s, i + 1) << 8 | (@getbyte s, i + 2)
    x.push @ALPHA.charAt b10 >> 18
    x.push @ALPHA.charAt b10 >> 12 & 0x3F
    x.push @ALPHA.charAt b10 >> 6 & 0x3f
    x.push @ALPHA.charAt b10 & 0x3f
    i += 3
  switch s.length - imax
    when 1
      b10 = (@getbyte s, i) << 16
      x.push (@ALPHA.charAt b10 >> 18) + (@ALPHA.charAt b10 >> 12 & 0x3F) +
        @PADCHAR + @PADCHAR
    when 2
      b10 = (@getbyte s, i) << 16 | (@getbyte s, i + 1) << 8
      x.push (@ALPHA.charAt b10 >> 18) + (@ALPHA.charAt b10 >> 12 & 0x3F) +
        (@ALPHA.charAt b10 >> 6 & 0x3f) + @PADCHAR
  x.join ""

exports.$inject = ["$window"]