validator = require "validator"
url = require "url"
querystring = require "querystring"

map =
  "552648d96115ef4f7734b9b7" : 10
  "552649756115ef4f7734b9b8" : 11
  "55264a2c6115ef4f7734b9b9" : 12
  "55264d916115ef4f7734b9bb" : 13
  "5527e1b3e4d2652e15945901" : 17
  "5527e29ee4d2652e15945902" : 18
  "5528fab50a1c9a3145ae63dc" : 20
  "5528fd672b7956485f217218" : 19
  "5529043f3d75cc1261931ffc" : 21
  "552bb4b7b3211e9b3f662749" : 23
  "552cb09eb3211e9b3f66274d" : 26
  "552cd340699664ca7de4bc78" : 27
  "552cebf5699664ca7de4bc7c" : 28
  "552cf004699664ca7de4bc7f" : 31
  "552cf104699664ca7de4bc80" : 32
  "552d1180a3617c5b0de4318d" : 38
  "552d18ae014074ae0e863f77" : 36
  "552e086b014074ae0e863f7b" : 16
  "552ead919fe7f463513b15c3" : 48
  "552f9aa906fa85f52ebe3c56" : 39
  "55374a7b05c8e69675647eca" : 43
  "553a96f72b7850c17093adf9" : 45
  "553a9a352b7850c17093adfb" : 46
  "553a9df52b7850c17093adfd" : 47
  "553e295718d1aac803e95db8" : 49
  "554408bd8a8ea0524ce920e2" : 50
  "55468f0a8a8ea0524ce920e3" : 51
  "5549bf7b8a8ea0524ce920e6" : 52
  "5549c05f8a8ea0524ce920e7" : 65
  "5549c8628a8ea0524ce920e8" : 54
  "554ddc43918733ea68a5a07c" : 56
  "554ddd39918733ea68a5a07d" : 57
  "5553a9af918733ea68a5a081" : 22
  "5553ab8a918733ea68a5a083" : 61
  "5553ae59918733ea68a5a086" : 64
  "5553af99918733ea68a5a088" : 66
  "555430f3918733ea68a5a08a" : 67


exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    if request.params.length == 0 then return next()

    newId = map[request.params[0]]
    if not newId? then return next()

    # Reconstruct the query string
    query = (url.parse request.url, true).query or {}
    try newqueryString = querystring.stringify query
    catch e then newqueryString = ""

    # Redirect to the new URL
    response.redirect "/c/#{newId}?#{newqueryString}"

exports["@singleton"] = true