exports.seed = (knex, Promise) ->
  uid = 0

  ins = (id, name="", parent) ->
    slug = name.toLowerCase().replace(/&/g, "").replace /[,\s]+/g, "-"
    values =
      id: ++uid
      slug: "#{slug}-#{uid}"
      name: name
    if id? then values.id = id
    if parent? then values.parent = parent
    (knex "sharing_categories").insert values


  Promise.all([
    # First the parent categories
    (ins 1,  "General Items")
    (ins 2,  "Electronics")
    (ins 3,  "Hobbies & Crafts")
    (ins 4,  "Music, Movies & Books")
    (ins 5,  "Vehicles")
    (ins 6, "Pets & Animals")
    (ins 7, "Miscellaneous")
  ]).then -> Promise.all([
    # Then the child categories
    (ins null, "Baby Items", 1)
    (ins null, "Beauty & Health", 1)
    (ins null, "Clothing & Accessories", 1)
    (ins null, "Furniture & Decor", 1)
    (ins null, "Home Appliances", 1)
    (ins null, "Tools", 1)
    (ins null, "Jewelery & Watches", 1)
    (ins null, "Sports & Exercise", 1)
    (ins null, "Toys & Games", 1)
    (ins null, "Others", 1)

    # Electronics
    (ins null, "Camcorders & Cameras", 2)
    (ins null, "Computers & Laptops", 2)
    (ins null, "Gaming", 2)
    (ins null, "Headphones & MP3", 2)
    (ins null, "Phones & Tablets", 2)
    (ins null, "Television & Home Theater", 2)
    (ins null, "Video Games & Software", 2)
    (ins null, "Others", 2)

    # Hobbies, Crafts & DIY
    (ins null, "Art & Collectibles", 3)
    (ins null, "Creative & Crafts", 3)
    (ins null, "Painting & Art", 3)
    (ins null, "Sewing, Quilting & Knitting", 3)
    (ins null, "Others", 3)

    # Music, Movies & Books
    (ins null, "Books", 4)
    (ins null, "Movies", 4)
    (ins null, "Music", 4)
    (ins null, "Others", 4)

    # Vehicles
    (ins null, "Campers, RVs & Trailers", 5)
    (ins null, "Cars, Trucks, SUVs & Vans", 5)
    (ins null, "Motorcycles & Bikes", 5)
    (ins null, "Watercraft & Trailers", 5)
    (ins null, "Others", 5)

    # Pets
    (ins null, "Birds", 6)
    (ins null, "Cats & Kittens", 6)
    (ins null, "Dogs & Puppies", 6)
    (ins null, "Fish & Aquatic Pets", 6)
    (ins null, "Livestock", 6)
    (ins null, "Supplies & Accessories", 6)
    (ins null, "Others", 6)

    # Miscellaneous
    (ins null, "Volunteer Activities", 7)
    (ins null, "Yard & Garage Sales", 7)
    (ins null, "Lost & Found", 7)
    (ins null, "Others", 7)
  ])