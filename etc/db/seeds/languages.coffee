exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", slug) ->
    values =
      id: ++uid
      slug: "#{slug}"
      name: name
    (knex "languages").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("languages").del(),

    (ins "English", "en"),
    (ins "Arabic", "ar"),
    (ins "Hindi", "in")
  )
