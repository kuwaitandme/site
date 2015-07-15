exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", description, color) ->
    slug = name.toLowerCase().replace(/[&\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
      description: description
      status: 1
      meta: JSON.stringify bgColor: color
    knex("forum_categories").insert values


  Promise.join(
    (ins "General Discussion", "A place to talk about whatever you want", "#59b3d0"),
    (ins "Blogs", "Blog posts from individual members", "#86ba4b"),
    (ins "Announcements", "Announcements regarding our community", "#fda34b"),
    (ins "Comments &amp; Feedback", "Got a question? Ask away!", "#e95c5a")
  )
