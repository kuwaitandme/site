exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", message) ->
    values =
      id: ++uid
      name: name
      message: ""
    (knex "log_types").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("log_types").del(),

    (ins "login", "the user has logged in"),
    (ins "logout", "the user has logged out")
  )
