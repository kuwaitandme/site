module.exports = (route) ->
  route "/auth/logout",                            "auth/logout"
  route "/auth/oauth/([a-z]+)",                    "auth/oauth/index"
  route "/auth/oauth/([a-z]+)/callback",           "auth/oauth/callback"
