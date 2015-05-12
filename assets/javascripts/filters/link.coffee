module.exports =  -> (link) ->
  maxLength = 50
  if link.length > maxLength then link = "#{link.substring 0, maxLength}..."
  result = link.replace /.*?:\/\//g, ""