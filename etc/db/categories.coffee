json = {
  "General Items" : {
    "Baby Items"
    "Beauty & Health"
    "Clothing & Accessories"
    "Furniture & Decor"
    "Home Appliances"
    "Instruments"
    "Jewelery & Watches"
    "Sports & Exercise"
    "Toys & Games"
    "Other"
  }

  "Careers & Jobs": {
    "Administrative"
    "Internships"
    "Service"
    "Resumes"
    "Other"
  }

  "Community & Events": {
    "Carpool & Ride Share"
    "Local Events & Activities"
    "Lost & Found"
    "Tickets & Gift Cards"
    "Volunteer Activities"
    "Yard & Garage Sales"
    "Other"
  }

  "Matrimonial": {
    "Bride seeking groom"
    "Groom seeking bride"
    "Wedding Planners"
    "Other"
  }

  "Electronics & Computers": {
    "Camcorders & Cameras"
    "Computers & Laptops"
    "Gaming"
    "Headphones & MP3"
    "Phones & Tablets"
    "Television & Home Theater"
    "Video Games & Software"
    "Other"
  }

  "Property & Real-Estate": {
    "Commercial Space"
    "Flats & Rooms"
    "Houses"
    "Land"
    "Other"
  }

  "Hobbies, Crafts & DIY": {
    "Art & Collectibles"
    "Creative & Crafts"
    "Painting & Art"
    "Sewing, Quilting & Knitting"
    "Other"
  }


  "Music, Movies & Books": {
    "Books"
    "Movies"
    "Music"
    "Other"
  }
  "Vehicles": {
    "Campers, RVs & Trailers"
    "Cars, Trucks, SUVs & Vans"
    "Motorcycles & Bikes"
    "Watercraft & Trailers"
    "Other"
  }

  "Services": {
    "Animal & Pet"
    "Child & Elderly"
    "Cleaning"
    "Contractors"
    "Design & IT"
    "Education & Classes"
    "Fitness & Health"
    "Legal & Business"
    "Moving & Storage"
    "Sales & Marketing"
    "Other"
  }

  "Pets & Animals": {
    "Birds"
    "Cats & Kittens"
    "Dogs & Puppies"
    "Fish & Aquatic Pets"
    "Livestock"
    "Supplies & Accessories"
    "Others"
  }

  "Miscellaneous"
}

createCategory = (name) ->
  slug = (name.toLowerCase().replace /&/g, "").replace(/[,\s]+/g, "-")
  name: name, _id: ObjectId(), slug: slug

getMonogoJson = (json) ->
  categories = []

  for cat, children of json
    category = createCategory cat

    if typeof children is "object"
      category.children = getMonogoJson children
    categories.push category

  categories

db.categories.drop()
db.categories.insert getMonogoJson json