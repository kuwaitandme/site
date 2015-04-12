module.exports = cookie =
  createCookie: (name, value, days) ->
    `var expires`
    if days
      date = new Date
      date.setTime date.getTime() + days * 24 * 60 * 60 * 1000
      expires = '; expires=' + date.toGMTString()
    else
      expires = ''
    document.cookie = name + '=' + value + expires + '; path=/'

  readCookie: (name) ->
    nameEQ = name + '='
    ca = document.cookie.split(';')
    i = 0
    while i < ca.length
      c = ca[i]
      while c.charAt(0) == ' '
        c = c.substring(1, c.length)
      if c.indexOf(nameEQ) == 0
        return c.substring(nameEQ.length, c.length)
      i++

  eraseCookie: (name) -> @createCookie name, '', -1