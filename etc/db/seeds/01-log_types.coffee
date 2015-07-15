exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", message) ->
    values =
      id: ++uid
      name: name
      message: ""
    (knex "log_types").insert values

  Promise.join(
    (ins "login", "the user has logged in"),
    (ins "logout", "the user has logged out")
  )
