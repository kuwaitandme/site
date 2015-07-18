bCrypt    = require "bcrypt-nodejs"
md5       = require "MD5"

hashPassword = (p) -> bCrypt.hashSync p, (bCrypt.genSaltSync 10), null

exports.seed = (knex, Promise) ->
  # New admin, username: admin, password: admin
  newAdmin =
    id: 1
    rss_token: md5 "#{Math.random()}"
    mailing_list_token: md5 "#{Math.random()}"
    email: "admin@mail.com"
    username: "admin"
    slug: "admin"
    password: hashPassword "admin"
    signature: "I am the administrator!"
    about: "I'm your friendly neighborhood admin"
    name: "Admin John"
    language: 1
    status: 1
    role: 3
    created_at: new Date()
    updated_at: new Date()

  # New moderator, username: moderator, password: moderator
  newModerator =
    id: 2
    rss_token: md5 "#{Math.random()}"
    mailing_list_token: md5 "#{Math.random()}"
    email: "moderator@mail.com"
    username: "moderator"
    slug: "moderator"
    password: hashPassword "moderator"
    signature: "I am the mood!"
    about: "I'm your friendly neighborhood moderator"
    name: "Admin John"
    language: 1
    status: 2
    role: 2
    created_at: new Date()
    updated_at: new Date()

  # New regular user, username: john, password: pass
  newUser =
    id: 3
    rss_token: md5 "#{Math.random()}"
    mailing_list_token: md5 "#{Math.random()}"
    email: "john@mail.com"
    username: "john"
    slug: "john"
    password: hashPassword "pass"
    signature: "I like cookies"
    about: "My name is john hon bon!"
    name: "John Rogers"
    language: 1
    status: 2
    role: 2
    created_at: new Date()
    updated_at: new Date()


  knex("users").insert newAdmin
  .then -> knex("users").insert newModerator
  .then -> knex("users").insert newUser
