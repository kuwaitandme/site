exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", slug) ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    (knex "forum_post_statuses").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("forum_post_statuses").del(),

    (ins "Active"),
    (ins "Banned"),
    (ins "Blocked"),
    (ins "Disabled"),
    (ins "Flagged"),
    (ins "In-Active"),
    (ins "Rejected")
  )
