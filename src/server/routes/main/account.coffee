module.exports = (route) ->
  route "/account",                                "account/index"
  route "/account/classifieds",                    "account/classifieds"
  route "/account/classifieds/([0-9]*)",           "account/classifieds"
  route "/account/credits",                        "account/credits"
  route "/account/messages",                       "account/messages"
  route "/account/messages/([0-9]*)",              "account/messages"
  route "/account/moderate",                       "account/moderate"
  route "/account/moderate/([0-9]*)",              "account/moderate"
  route "/account/profile",                        "account/profile"
