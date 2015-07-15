exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", slug) ->
    values =
      id: ++uid
      slug: "#{slug}"
      name: name
    (knex "languages").insert values

  # Deletes ALL existing entries
  knex("users").del()
  .then -> knex("languages").del()
  .then -> Promise.join(
    (ins "English", "en"),
    (ins "Arabic", "ar"),
    (ins "Hindi", "in")
  )
