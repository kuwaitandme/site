exports.seed = (knex, Promise) ->
  uid = 0
  ins = (name="") ->
    values =
      id: ++uid
      name: name
    knex("sharing_item_types").insert values


  Promise.all([
    ins("borrow")
    ins("buy")
    ins("giveaway")
    ins("lend")
    ins("sell")
    ins("want")
  ])