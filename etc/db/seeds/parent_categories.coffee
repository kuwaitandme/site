exports.seed = (knex, Promise) ->
  _ins = (id, name="", parent) ->
    values =
      slug: name.toLowerCase().replace(/&/g, '').replace /[,\s]+/g, '-'
      name: name
      id: id
    (knex "parent_categories").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("parent_categories").del(),

    # Inserts seed entries
    (_ins 1,  "General Items"),
    (_ins 2,  "Careers & Jobs"),
    (_ins 3,  "Community & Events"),
    (_ins 4,  "Matrimonial"),
    (_ins 5,  "Electronics & Computers"),
    (_ins 6,  "Property & Real-Estate"),
    (_ins 7,  "Hobbies, Crafts & DIY"),
    (_ins 8,  "Music, Movies & Books"),
    (_ins 9,  "Vehicles"),
    (_ins 10, "Services"),
    (_ins 11, "Pets & Animals"),
    (_ins 12, "Miscellaneous")

  )