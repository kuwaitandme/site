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
    # console.log values
    (knex "sharing_categories").insert values
    .catch (error) ->
      console.log values
      throw error

  knex("sharing_categories").del()
  .then -> Promise.join(
    # First the parent categories
    (ins 1,  "General Items"),
    (ins 2,  "Careers & Jobs"),
    (ins 3,  "Community & Events"),
    # (ins 4,  "Matrimonial"),
    (ins 4,  "Electronics & Computers"),
    (ins 5,  "Property & Real-Estate"),
    (ins 6,  "Hobbies, Crafts & DIY"),
    (ins 7,  "Music, Movies & Books"),
    (ins 8,  "Vehicles"),
    (ins 9, "Services"),
    (ins 10, "Pets & Animals"),
    (ins 11, "Miscellaneous")
  ).then -> Promise.join(
    # Deletes ALL existing entries

    # Then the child categories
    (ins null, "Baby Items", 1),
    (ins null, "Beauty & Health", 1),
    (ins null, "Clothing & Accessories", 1),
    (ins null, "Furniture & Decor", 1),
    (ins null, "Home Appliances", 1),
    (ins null, "Instruments", 1),
    (ins null, "Jewelery & Watches", 1),
    (ins null, "Sports & Exercise", 1),
    (ins null, "Toys & Games", 1),
    (ins null, "Others", 1),

    (ins null, "Administrative", 2),
    (ins null, "Internships", 2),
    (ins null, "Service", 2),
    (ins null, "Resumes", 2),
    (ins null, "Others", 2),

    (ins null, "Carpool & Ride Share", 3),
    (ins null, "Local Events & Activities", 3),
    (ins null, "Lost & Found", 3),
    (ins null, "Tickets & Gift Cards", 3),
    (ins null, "Volunteer Activities", 3),
    (ins null, "Yard & Garage Sales", 3),
    (ins null, "Others", 3),

    # (ins null, "Bride seeking groom", 4),
    # (ins null, "Groom seeking bride", 4),
    # (ins null, "Wedding Planners", 4),
    # (ins null, "Others", 4),

    (ins null, "Camcorders & Cameras", 4),
    (ins null, "Computers & Laptops", 4),
    (ins null, "Gaming", 4),
    (ins null, "Headphones & MP3", 4),
    (ins null, "Phones & Tablets", 4),
    (ins null, "Television & Home Theater", 4),
    (ins null, "Video Games & Software", 4),
    (ins null, "Others", 4),

    (ins null, "Commercial Space", 5),
    (ins null, "Flats & Rooms", 5),
    (ins null, "Houses", 5),
    (ins null, "Land", 5),
    (ins null, "Others", 5),

    # Hobbies, Crafts & DIY
    (ins null, "Art & Collectibles", 6),
    (ins null, "Creative & Crafts", 6),
    (ins null, "Painting & Art", 6),
    (ins null, "Sewing, Quilting & Knitting", 6),
    (ins null, "Others", 6),

    # Music, Movies & Books
    (ins null, "Books", 7),
    (ins null, "Movies", 7),
    (ins null, "Music", 7),
    (ins null, "Others", 7),

    # Vehicles
    (ins null, "Campers, RVs & Trailers", 8),
    (ins null, "Cars, Trucks, SUVs & Vans", 8),
    (ins null, "Motorcycles & Bikes", 8),
    (ins null, "Watercraft & Trailers", 8),
    (ins null, "Others", 8),

    # Services
    (ins null, "Animal & Pet", 9),
    (ins null, "Child & Elderly", 9),
    (ins null, "Cleaning", 9),
    (ins null, "Contractors", 9),
    (ins null, "Design & IT", 9),
    (ins null, "Education & Classes", 9),
    (ins null, "Fitness & Health", 9),
    (ins null, "Legal & Business", 9),
    (ins null, "Moving & Storage", 9),
    (ins null, "Sales & Marketing", 9),
    (ins null, "Others", 9),

    # Pets
    (ins null, "Birds", 10),
    (ins null, "Cats & Kittens", 10),
    (ins null, "Dogs & Puppies", 10),
    (ins null, "Fish & Aquatic Pets", 10),
    (ins null, "Livestock", 10),
    (ins null, "Supplies & Accessories", 10),
    (ins null, "Others", 10)

    # Miscellaneous
    (ins null, "Websites", 11)
    (ins null, "Others", 11)
  )
