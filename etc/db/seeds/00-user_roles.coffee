exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    knex("user_roles").insert values

  # Deletes ALL existing entries
  knex("users").del()
  .then -> knex("user_roles").del()

  # Insert
  .then -> Promise.join(
      ins("Normal"),
      ins("Moderator"),
      ins("Admin")
    )
