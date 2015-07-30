exports.seed = (knex, Promise) ->
  uid = 0
  ins = (options) ->
    slug = options.title.toLowerCase().replace(/&/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      title: options.title
      description: options.description
      inactive: options.inactive or false
      hotness_mod: options.hotness_mod or 0
      slug: "#{slug}-#{uid}"
      meta: JSON.stringify color: options.color
    (knex "news_categories").insert values


  category1 =
    title: "Global"
    description: "Worldwide news"
    color: "#fffcd7"

  category2 =
    title: "Film"
    description: "film related news"
    color: "#ddebf9"

  category3 =
    title: "National"
    description: "national news"
    color: "#fffcd7"


  Promise.join(
    (ins category1),
    (ins category2),
    (ins category3)
  )
