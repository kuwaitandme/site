json = {
  'General Items' : {
    'Art & Collectibles'
    'Baby Items'
    'Beauty & Health'
    'CDs & DVDs'
    'Clothing & Accessories'
    'Farm & Garden'
    'Furniture'
    'Home Appliances'
    "Homeware & Decor"
    'Jewelery & Watches'
    'Mobiles & MP3'
    'Musical Instruments'
    'Sports & Exercise'
    'Tools'
    'Toys & Games'
    'Video Games & Software'
    'Other'
  }

  'Careers & Jobs': {
    'Administrative'
    'Internships'
    'Service'
    'Resumes'
    'Other'
  }

  'Community & Events': {
    'Carpool & Ride Share'
    'Local Events & Activities'
    'Lost & Found'
    'Tickets & Gift Cards'
    'Volunteer Activities'
    'Yard & Garage Sales'
    'Other'
  }

  'Electronics & Computers': {
    'Camcorders & Cameras'
    'Computers & Laptops'
    'Gaming'
    'Phones & Tablets'
    'Television & Home Theater'
    'Other'
  }

  'Hobbies, Crafts & DIY': {
    'Creative & Crafts'
    'Painting & Art'
    'Sewing & Quilting & Knitting'
    'Other'
  }

  'Matrimonial': {
    'Bride seeking groom'
    'Groom seeking bride'
    'Wedding Planners'
    'Other'
  }

  'Music, Movies & Books': {
    'Music'
    'Movies'
    'Books'
    'Other'
  }

  'Pets & Animals': {
    'Birds'
    'Cats & Kittens'
    'Dogs & Puppies'
    'Fish & Aquatic Pets'
    'Livestock'
    'Supplies & Accessories'
    'Others'
  }

  'Property & Real-Estate': {
    'Commercial Space'
    'Flats & Rooms'
    'Houses'
    'Land'
    'Other'
  }

  'Services': {
    'Animal & Pet'
    'Child & Elderly'
    'Cleaning'
    'Contractors'
    'Design & IT'
    'Education & Classes'
    'Fitness & Health'
    'Legal & Business'
    'Moving & Storage'
    'Sales & Marketing'
    'Other'
  }

  'Vehicles': {
    'Campers, RVs & Trailers'
    'Cars, Trucks, SUVs & Vans'
    'Motorcycles & Bikes'
    'Watercraft & Trailers'
    'Other'
  }

  'Miscellaneous'
}

createCategory = (name) -> { name: name, _id: ObjectId() }

getMonogoJson = (json) ->
  categories = []

  for cat, children of json
    category = createCategory cat

    if typeof children is 'object'
      category.children = getMonogoJson children
    categories.push category

  categories

db.categories.drop()
db.categories.insert getMonogoJson json