fs        = require 'fs'
requestIP = require 'request-ip'

module.exports = (request, message, type='info') ->
  _twodigits = (number) -> "0#{number}".slice -2

  ip = requestIP.getClientIp request

  date = new Date
  hours = _twodigits date.getHours()
  minutes = _twodigits date.getMinutes()
  seconds = _twodigits date.getSeconds()
  month = _twodigits date.getMonth() + 1
  year = date.getFullYear()
  day = _twodigits date.getDate()

  timestamp = "#{day}/#{month}/#{year}@#{hours}:#{minutes}:#{seconds}"
  content = "#{timestamp} [#{ip}] > #{message}\n"

  logfiles = global.config.logfiles
  if type is 'info'
    path = "#{global.root}/../#{logfiles['info']}"
    infoStream  = fs.createWriteStream path, flags: 'a'
    infoStream.write content
  else
    path = "#{global.root}/../#{logfiles['error']}"
    errorStream = fs.createWriteStream path, flags: 'a'
    errorStream.write content