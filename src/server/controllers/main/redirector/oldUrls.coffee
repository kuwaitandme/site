querystring = require "querystring"
url         = require "url"
validator   = require "validator"


map =
  "classified/552648d96115ef4f7734b9b7" : "/c/10"
  "classified/552649756115ef4f7734b9b8" : "/c/11"
  "classified/55264a2c6115ef4f7734b9b9" : "/c/12"
  "classified/55264d916115ef4f7734b9bb" : "/c/13"
  "classified/5527e1b3e4d2652e15945901" : "/c/17"
  "classified/5527e29ee4d2652e15945902" : "/c/18"
  "classified/5528fab50a1c9a3145ae63dc" : "/c/20"
  "classified/5528fd672b7956485f217218" : "/c/19"
  "classified/5529043f3d75cc1261931ffc" : "/c/21"
  "classified/552bb4b7b3211e9b3f662749" : "/c/23"
  "classified/552cb09eb3211e9b3f66274d" : "/c/26"
  "classified/552cd340699664ca7de4bc78" : "/c/27"
  "classified/552cebf5699664ca7de4bc7c" : "/c/28"
  "classified/552cf004699664ca7de4bc7f" : "/c/31"
  "classified/552cf104699664ca7de4bc80" : "/c/32"
  "classified/552d1180a3617c5b0de4318d" : "/c/38"
  "classified/552d18ae014074ae0e863f77" : "/c/36"
  "classified/552e086b014074ae0e863f7b" : "/c/16"
  "classified/552ead919fe7f463513b15c3" : "/c/48"
  "classified/552f9aa906fa85f52ebe3c56" : "/c/39"
  "classified/55374a7b05c8e69675647eca" : "/c/43"
  "classified/553a96f72b7850c17093adf9" : "/c/45"
  "classified/553a9a352b7850c17093adfb" : "/c/46"
  "classified/553a9df52b7850c17093adfd" : "/c/47"
  "classified/553e295718d1aac803e95db8" : "/c/49"
  "classified/554408bd8a8ea0524ce920e2" : "/c/50"
  "classified/55468f0a8a8ea0524ce920e3" : "/c/51"
  "classified/5549bf7b8a8ea0524ce920e6" : "/c/52"
  "classified/5549c05f8a8ea0524ce920e7" : "/c/65"
  "classified/5549c8628a8ea0524ce920e8" : "/c/54"
  "classified/554ddc43918733ea68a5a07c" : "/c/56"
  "classified/554ddd39918733ea68a5a07d" : "/c/57"
  "classified/5553a9af918733ea68a5a081" : "/c/22"
  "classified/5553ab8a918733ea68a5a083" : "/c/61"
  "classified/5553ae59918733ea68a5a086" : "/c/64"
  "classified/5553af99918733ea68a5a088" : "/c/66"
  "classified/555430f3918733ea68a5a08a" : "/c/67"

  "about"         : "/"
  "auth/login"    : "/auth"
  "auth/signup"   : "/auth"
  "contact"       : "/"
  "terms-privacy" : "/info/terms-privacy"

exports = module.exports = ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    newUrl = map[request.params[0]]
    if not newUrl? then return next()

    # Reconstruct the query string
    query = (url.parse request.url).query
    if query then response.redirect "#{newUrl}?#{query}"
    else response.redirect "#{newUrl}"

exports["@singleton"] = true