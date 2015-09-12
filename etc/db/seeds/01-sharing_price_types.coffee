exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    (knex "sharing_price_types").insert values

  Promise.join(
    (ins "Contact Owner"),
    (ins "Free"),
    (ins "Range")
  )