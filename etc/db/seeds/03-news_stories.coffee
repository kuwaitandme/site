exports.seed = (knex, Promise) ->
  post =
    id: 1
    title: "This is the first link"
    description: "This is sometings cool"
    description_markdown: "<p>This is sometings cool</p>"
    short_id: "oovzkk"
    url: "https://github.com/jcs/lobsters"
    upvotes: 0
    downvotes: 0
    hotness: -11088.4732896
    comments_count: 1
    is_expired: false
    is_moderated: true
    created_by: 1
    merged_story: 1


  knex("news_stories").insert post
