exports.seed = (knex, Promise) ->
  post1 =
    id: 1
    title: "This is the first link"
    description: "This is sometings cool"
    description_markdown: "<p>This is sometings cool</p>"
    slug: "this-is-something-1"
    url: "https://github.com/jcs/lobsters"
    upvotes: 0
    downvotes: 0
    hotness: -11088.4732896
    comments_count: 1
    is_expired: false
    is_moderated: true
    created_by: 1
    merged_story: 1

  post2 =
    id: 2
    title: "What’s Your Pain Threshold?"
    description: "This is sometings cool"
    description_markdown: "<p>This is sometings cool</p>"
    slug: "this-is-something-2"
    url: "https://github.com/jcs/lobsters"
    upvotes: 0
    downvotes: 0
    hotness: -11088.4732896
    comments_count: 1
    is_expired: false
    is_moderated: true
    created_by: 1
    merged_story: 1


  post3 =
    id: 3
    title: "This is the third link"
    description: "This is sometings cool"
    description_markdown: "<p>This is sometings cool</p>"
    slug: "this-is-something-3"
    url: "https://github.com/jcs/lobsters"
    upvotes: 0
    downvotes: 0
    hotness: -11088.4732896
    comments_count: 1
    is_expired: false
    is_moderated: true
    created_by: 1
    merged_story: 1


  knex("news_stories").insert post1
  .then -> knex("news_stories").insert post2
  .then -> knex("news_stories").insert post3
