exports.seed = (knex, Promise) ->
  # New admin, username: admin, password: admin
  post1 =
    id: 1
    content: "<h1>Welcome to your brand new forum!</h1>\n<p>This is what a topic and post looks like. As an administator, you can edit the post's title and content.<br />\nTo customise your forum, go to the <a href=\"../../admin\">Administrator Control Panel</a>. You can modify all aspects of your forum there, including installation of third-party plugins.</p>\n<h2>Additional Resources</h2>\n<ul>\n<li><a href=\"https://docs.nodebb.org\" rel=\"nofollow\">NodeBB Documentation</a></li>\n<li><a href=\"https://community.nodebb.org\" rel=\"nofollow\">Community Support Forum</a></li>\n<li><a href=\"https://github.com/nodebb/nodebb\" rel=\"nofollow\">Project repository</a></li>\n</ul>\n",
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
    content: "<h2>Submitting a Pull Request to NodeBB?</h2><p>First of all, thank you! Please consider this <a href='https://docs.nodebb.org/en/latest/contributing/style-guide.html' rel='nofollow'>style guide</a> when submitting your changes. Also, please join our <a href='https://community.nodebb.org'>community</a> to meet other NodeBB developers and designers <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p><h2>Contributor License Agreement</h2><p>Thank you for considering contributing to NodeBB. <strong>Before we can accept any pull requests, please take a moment to read and sign our <a href='https://www.clahub.com/agreements/NodeBB/NodeBB' rel='nofollow'>license agreement</a></strong>. In summary, signing this document means that 1) you own the code that you are contributing and 2) you give permission to NodeBB Inc. to license the code to others. This agreement applies to any repository under the NodeBB organization.</p><p>If you are writing contributions as part of employment from another company / individual, then your employer will need to sign a separate agreement. Please <a href='mailto:accounts@nodebb.org' rel='nofollow'>contact us</a> so that we can send this additional agreement to your employer.</p><h2>Why do I have to sign this?</h2><p>Long story short, the GPLv3 can be a bit scary for companies wanting to deeply integrate NodeBB with their own software, so the ability to create a secondary commercial license for them is important. It also opens a potential revenue stream for us, but really, we just want to see some big players use NodeBB - it would be a great endorsement for the product that we are all building.  <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p><h2>&quot;I've already contributed but I don't want to sign this&quot;</h2><p>As unfortunate as that is, we definitely will understand if for whatever reason you decide against signing this. We are setting a hard deadline of <strong>February 28th</strong> for existing contributors to accept this agreement - if not, due to legal constraints we will unfortunately have to either remove your contribution or rewrite it completely.</p><h3><a href='https://docs.google.com/forms/d/1KrniXs3pwK8dMeAZnnQz2D07ne7LjJTYIYwJrpDqgnE/viewform' rel='nofollow'>Contributor License Agreement</a></h3><p>Thanks again! <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p>",
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
    content: "<h2>Submitting a Pull Request to NodeBB?</h2><p>First of all, thank you! Please consider this <a href='https://docs.nodebb.org/en/latest/contributing/style-guide.html' rel='nofollow'>style guide</a> when submitting your changes. Also, please join our <a href='https://community.nodebb.org'>community</a> to meet other NodeBB developers and designers <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p><h2>Contributor License Agreement</h2><p>Thank you for considering contributing to NodeBB. <strong>Before we can accept any pull requests, please take a moment to read and sign our <a href='https://www.clahub.com/agreements/NodeBB/NodeBB' rel='nofollow'>license agreement</a></strong>. In summary, signing this document means that 1) you own the code that you are contributing and 2) you give permission to NodeBB Inc. to license the code to others. This agreement applies to any repository under the NodeBB organization.</p><p>If you are writing contributions as part of employment from another company / individual, then your employer will need to sign a separate agreement. Please <a href='mailto:accounts@nodebb.org' rel='nofollow'>contact us</a> so that we can send this additional agreement to your employer.</p><h2>Why do I have to sign this?</h2><p>Long story short, the GPLv3 can be a bit scary for companies wanting to deeply integrate NodeBB with their own software, so the ability to create a secondary commercial license for them is important. It also opens a potential revenue stream for us, but really, we just want to see some big players use NodeBB - it would be a great endorsement for the product that we are all building.  <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p><h2>&quot;I've already contributed but I don't want to sign this&quot;</h2><p>As unfortunate as that is, we definitely will understand if for whatever reason you decide against signing this. We are setting a hard deadline of <strong>February 28th</strong> for existing contributors to accept this agreement - if not, due to legal constraints we will unfortunately have to either remove your contribution or rewrite it completely.</p><h3><a href='https://docs.google.com/forms/d/1KrniXs3pwK8dMeAZnnQz2D07ne7LjJTYIYwJrpDqgnE/viewform' rel='nofollow'>Contributor License Agreement</a></h3><p>Thanks again! <img class='emoji emoji-extended' src='https://community.nodebb.org/plugins/nodebb-plugin-emoji-extended/images/grinning.png' title=':)' alt=':)' /></p>",
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

