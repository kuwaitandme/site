exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      name: name
    (knex "sharing_item_statuses").insert values


  Promise.join(
    (ins "active"),
    (ins "banned"),
    (ins "blocked"),
    (ins "flagged"),
    (ins "inactive"),
    (ins "rejected")
  )