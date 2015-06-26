exports.seed = (knex, Promise) ->
  _ins = (name="", parent) ->
    values =
      slug: name.toLowerCase().replace(/&/g, '').replace /[,\s]+/g, '-'
      name: name
      parent_category: parent
    (knex "child_categories").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("child_categories").del(),

    (_ins "Baby Items", 1),
    (_ins "Beauty & Health", 1),
    (_ins "Clothing & Accessories", 1),
    (_ins "Furniture & Decor", 1),
    (_ins "Home Appliances", 1),
    (_ins "Instruments", 1),
    (_ins "Jewelery & Watches", 1),
    (_ins "Sports & Exercise", 1),
    (_ins "Toys & Games", 1),
    (_ins "Others", 1),

    (_ins "Administrative", 2),
    (_ins "Internships", 2),
    (_ins "Service", 2),
    (_ins "Resumes", 2),
    (_ins "Others", 2),

    (_ins "Carpool & Ride Share", 3),
    (_ins "Local Events & Activities", 3),
    (_ins "Lost & Found", 3),
    (_ins "Tickets & Gift Cards", 3),
    (_ins "Volunteer Activities", 3),
    (_ins "Yard & Garage Sales", 3),
    (_ins "Others", 3),

    (_ins "Bride seeking groom", 4),
    (_ins "Groom seeking bride", 4),
    (_ins "Wedding Planners", 4),
    (_ins "Others", 4),

    (_ins "Camcorders & Cameras", 5),
    (_ins "Computers & Laptops", 5),
    (_ins "Gaming", 5),
    (_ins "Headphones & MP3", 5),
    (_ins "Phones & Tablets", 5),
    (_ins "Television & Home Theater", 5),
    (_ins "Video Games & Software", 5),
    (_ins "Others", 5),

    (_ins "Commercial Space", 6),
    (_ins "Flats & Rooms", 6),
    (_ins "Houses", 6),
    (_ins "Land", 6),
    (_ins "Others", 6),

    (_ins "Art & Collectibles", 7),
    (_ins "Creative & Crafts", 7),
    (_ins "Painting & Art", 7),
    (_ins "Sewing, Quilting & Knitting", 7),
    (_ins "Others", 7),

    (_ins "Books", 8),
    (_ins "Movies", 8),
    (_ins "Music", 8),
    (_ins "Others", 8),

    (_ins "Campers, RVs & Trailers", 9),
    (_ins "Cars, Trucks, SUVs & Vans", 9),
    (_ins "Motorcycles & Bikes", 9),
    (_ins "Watercraft & Trailers", 9),
    (_ins "Others", 9),

    # Services
    (_ins "Animal & Pet", 10),
    (_ins "Child & Elderly", 10),
    (_ins "Cleaning", 10),
    (_ins "Contractors", 10),
    (_ins "Design & IT", 10),
    (_ins "Education & Classes", 10),
    (_ins "Fitness & Health", 10),
    (_ins "Legal & Business", 10),
    (_ins "Moving & Storage", 10),
    (_ins "Sales & Marketing", 10),
    (_ins "Others", 10),

    # Pets
    (_ins "Birds", 11),
    (_ins "Cats & Kittens", 11),
    (_ins "Dogs & Puppies", 11),
    (_ins "Fish & Aquatic Pets", 11),
    (_ins "Livestock", 11),
    (_ins "Supplies & Accessories", 11),
    (_ins "Others", 11)

    # Miscellaneous
    (_ins "Websites", 12)
    (_ins "Others", 12)
  )
