exports.seed = (knex, Promise) ->
  _ins = (id, name="", parent) ->
    values =
      slug: name.toLowerCase().replace(/&/g, '').replace /[,\s]+/g, '-'
      name: name
    if id? then values.id = id
    if parent? then values.parent_category = parent
    (knex "categories").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("categories").del(),

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
    (_ins 12, "Miscellaneous"),

    (_ins null, "Baby Items", 1),
    (_ins null, "Beauty & Health", 1),
    (_ins null, "Clothing & Accessories", 1),
    (_ins null, "Furniture & Decor", 1),
    (_ins null, "Home Appliances", 1),
    (_ins null, "Instruments", 1),
    (_ins null, "Jewelery & Watches", 1),
    (_ins null, "Sports & Exercise", 1),
    (_ins null, "Toys & Games", 1),
    (_ins null, "Others", 1),

    (_ins null, "Administrative", 2),
    (_ins null, "Internships", 2),
    (_ins null, "Service", 2),
    (_ins null, "Resumes", 2),
    (_ins null, "Others", 2),

    (_ins null, "Carpool & Ride Share", 3),
    (_ins null, "Local Events & Activities", 3),
    (_ins null, "Lost & Found", 3),
    (_ins null, "Tickets & Gift Cards", 3),
    (_ins null, "Volunteer Activities", 3),
    (_ins null, "Yard & Garage Sales", 3),
    (_ins null, "Others", 3),

    (_ins null, "Bride seeking groom", 4),
    (_ins null, "Groom seeking bride", 4),
    (_ins null, "Wedding Planners", 4),
    (_ins null, "Others", 4),

    (_ins null, "Camcorders & Cameras", 5),
    (_ins null, "Computers & Laptops", 5),
    (_ins null, "Gaming", 5),
    (_ins null, "Headphones & MP3", 5),
    (_ins null, "Phones & Tablets", 5),
    (_ins null, "Television & Home Theater", 5),
    (_ins null, "Video Games & Software", 5),
    (_ins null, "Others", 5),

    (_ins null, "Commercial Space", 6),
    (_ins null, "Flats & Rooms", 6),
    (_ins null, "Houses", 6),
    (_ins null, "Land", 6),
    (_ins null, "Others", 6),

    (_ins null, "Art & Collectibles", 7),
    (_ins null, "Creative & Crafts", 7),
    (_ins null, "Painting & Art", 7),
    (_ins null, "Sewing, Quilting & Knitting", 7),
    (_ins null, "Others", 7),

    (_ins null, "Books", 8),
    (_ins null, "Movies", 8),
    (_ins null, "Music", 8),
    (_ins null, "Others", 8),

    (_ins null, "Campers, RVs & Trailers", 9),
    (_ins null, "Cars, Trucks, SUVs & Vans", 9),
    (_ins null, "Motorcycles & Bikes", 9),
    (_ins null, "Watercraft & Trailers", 9),
    (_ins null, "Others", 9),

    # Services
    (_ins null, "Animal & Pet", 10),
    (_ins null, "Child & Elderly", 10),
    (_ins null, "Cleaning", 10),
    (_ins null, "Contractors", 10),
    (_ins null, "Design & IT", 10),
    (_ins null, "Education & Classes", 10),
    (_ins null, "Fitness & Health", 10),
    (_ins null, "Legal & Business", 10),
    (_ins null, "Moving & Storage", 10),
    (_ins null, "Sales & Marketing", 10),
    (_ins null, "Others", 10),

    # Pets
    (_ins null, "Birds", 11),
    (_ins null, "Cats & Kittens", 11),
    (_ins null, "Dogs & Puppies", 11),
    (_ins null, "Fish & Aquatic Pets", 11),
    (_ins null, "Livestock", 11),
    (_ins null, "Supplies & Accessories", 11),
    (_ins null, "Others", 11)
  )