exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", slug) ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    (knex "chats_room_statuses").insert values

  Promise.join(
    (ins "Active"),
    (ins "Banned"),
    (ins "Blocked"),
    (ins "Disabled"),
    (ins "Flagged"),
    (ins "In-Active"),
    (ins "Rejected")
  )
