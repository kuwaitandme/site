exports.seed = (knex, Promise) ->
  post1 =
    id: 1
    title: "Welcome to your NodeBB!"
    slug: "welcome-to-your-nodebb-1"
    excerpt: "Welcome to your brand new forum!<p>This is what a topic"
    category: 1
    status: 1
    created_by: 1
    language: 1
    created_at: new Date()
    updated_at: new Date()

  post2 =
    id: 2
    title: "Submitting a Pull Request to NodeBB? Contributor License Agreement"
    slug: "submitting-a-pull-request-to-nodebb-contributor-license-agreement-2"
    excerpt: "Thank you for considering contributing to NodeBB. Before we can accept any pull requests, please take a moment to read and sign our license agreement. In summary, signing this document means that 1) "
    category: 2
    status: 1
    created_by: 1
    language: 1
    created_at: new Date()
    updated_at: new Date()

  post3 =
    id: 3
    title: "Submitting a Pull Request to NodeBB? Contributor License Agreement"
    slug: "submitting-a-pull-request-to-nodebb-contributor-license-agreement-3"
    excerpt: "Thank you for considering contributing to NodeBB. Before we can accept any pull requests, please take a moment to read and sign our license agreement. In summary, signing this document means that 1) "
    category: 2
    status: 1
    created_by: 1
    language: 1
    created_at: new Date()
    updated_at: new Date()



  knex("forum_topics").insert post1
  .then -> knex("forum_topics").insert post2
  .then -> knex("forum_topics").insert post3

