exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    (knex "sharing_statuses").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("sharing_statuses").del(),

    (ins "Active"),
    (ins "Banned"),
    (ins "Blocked"),
    (ins "Flagged"),
    (ins "In-Active"),
    (ins "Rejected")
  )
