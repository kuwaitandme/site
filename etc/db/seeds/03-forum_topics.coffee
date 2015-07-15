exports.seed = (knex, Promise) ->
  # New admin, username: admin, password: admin
  post =
    id: 1
    content: "<h1>Welcome to your brand new forum!</h1>\n<p>This is what a topic and post looks like. As an administator, you can edit the post's title and content.<br />\nTo customise your forum, go to the <a href=\"../../admin\">Administrator Control Panel</a>. You can modify all aspects of your forum there, including installation of third-party plugins.</p>\n<h2>Additional Resources</h2>\n<ul>\n<li><a href=\"https://docs.nodebb.org\" rel=\"nofollow\">NodeBB Documentation</a></li>\n<li><a href=\"https://community.nodebb.org\" rel=\"nofollow\">Community Support Forum</a></li>\n<li><a href=\"https://github.com/nodebb/nodebb\" rel=\"nofollow\">Project repository</a></li>\n</ul>\n",
    name: "Welcome to your NodeBB!"
    slug: "welcome-to-your-nodebb-1"
    forum_category: 1
    status: 1
    created_by: 1
    language: 1
    created_at: new Date()
    updated_at: new Date()


  knex("forum_topics").insert post
