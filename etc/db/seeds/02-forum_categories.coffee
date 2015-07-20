exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="", description, color, icon) ->
    slug = name.toLowerCase().replace(/[&;\-]/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
      description: description
      status: 1
      meta: JSON.stringify color: color, icon: icon
    knex("forum_categories").insert values


  Promise.join(
    (ins "Official Announcements", "Announcements regarding our community", "#fda34b", "&#xf0a1;"),
    (ins "General Discussion", "A place to talk about whatever you want", "#BA68C8", "&#xf0e5;"),
    # (ins "Blogs", "Blog posts from individual members", "#86ba4b", ),
    (ins "Creative Space", "Be different! Start something creative! This is your space.", "#4FC3F7", "&#xf1fc;"),
    # (ins "Help & Support", "Need help on something? Ask around here!", "#4FC3F7", "&#xf1fc;"),
    (ins "Off Topic", "For chit chats or anything off-topic.", "#7986CB", "&#xf0fc;"),
    (ins "Sports", "Everything about sports! In one place.", "#E57373", "&#xf1e3;"),
    (ins "Interesting", "Share things you find interesting and start a discussion!", "#4FC3F7", "&#xf0eb;"),
    (ins "Feedback & Suggestions", "Got an idea or a question? Let us know by posting here!", "#A1B56C", "&#xf071;"),
  )
