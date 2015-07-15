exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", slug) ->
    values =
      id: ++uid
      slug: "#{slug}"
      name: name
    (knex "languages").insert values


  Promise.join(
    (ins "English", "en"),
    (ins "Arabic", "ar"),
    (ins "Hindi", "in")
  )
