bCrypt    = require "bcrypt-nodejs"

hashPassword = (p) -> bCrypt.hashSync p, (bCrypt.genSaltSync 10), null

exports.seed = (knex, Promise) ->
  # New admin, username: admin, password: admin
  newAdmin =
    email: 'admin@mail.com'
    username: 'admin'
    slug: 'admin'
    password: hashPassword 'admin'
    signature: 'I am the administrator!'
    about: 'I\'m your friendly neighborhood admin'
    name: 'Admin John'
    language: 1
    status: 1
    role: 3

  # New moderator, username: moderator, password: moderator
  newModerator =
    email: 'moderator@mail.com'
    username: 'moderator'
    slug: 'moderator'
    password: hashPassword 'moderator'
    signature: 'I am the mood!'
    about: 'I\'m your friendly neighborhood moderator'
    name: 'Admin John'
    language: 1
    status: 2
    role: 2

  # New regular user, username: john, password: pass
  newUser =
    email: 'john@mail.com'
    username: 'john'
    slug: 'john'
    password: hashPassword 'pass'
    signature: 'I like cookies'
    about: 'My name is john hon bon!'
    name: 'John Rogers'
    language: 1
    status: 2
    role: 2


  knex("users").del().then ->
    knex("users").insert(newAdmin)
  .then ->
    knex("users").insert(newModerator)
  .then ->
    knex("users").insert(newUser)
