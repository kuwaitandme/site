exports.seed = (knex, Promise) ->
  item =
    title: "A green backpack"
    slug: "a-green-backpack"
    description: "this my green backpack"
    parent_category: 1
    child_category: 12
    location: 1
    created_by: 3
    price_type: 2
    price_value: 0
    language: 1
    status: 1
    view_count: 2
    contact: {}
    images: []
    meta: {}
    type: 1


  knex("sharing_items").insert item