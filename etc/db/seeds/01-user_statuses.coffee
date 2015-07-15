exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    (knex "user_statuses").insert values


  Promise.join(
    (ins "Active"),
    (ins "Banned"),
    (ins "Blocked"),
    (ins "In-Active")
  )
