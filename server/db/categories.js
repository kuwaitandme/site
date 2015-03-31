var createCategory, getMonogoJson, json;

json = {
  'Apparel, Jewelery & Accessories': {
    'Kids': {
      'Clothing 2T-5T': 'Clothing 2T-5T',
      'Clothing 6+': 'Clothing 6+',
      'Accessories & Jewelery': 'Accessories & Jewelery',
      'Outer Wear': 'Outer Wear',
      'Shoes & boots': 'Shoes & boots',
      'Other': 'Other'
    },
    'Womens': {
      'Dresses & Skirts': 'Dresses & Skirts',
      'Excercise & Activewear': 'Excercise & Activewear',
      'Hats & Accessories': 'Hats & Accessories',
      'Jewelery': 'Jewelery',
      'Tops': 'Tops',
      'Bottoms': 'Bottoms',
      'Maternity Clothes': 'Maternity Clothes',
      'Outerwear': 'Outerwear',
      'Shoes & Boots': 'Shoes & Boots',
      'Wedding Dresses': 'Wedding Dresses',
      'Other': 'Other'
    },
    'Mens': {
      'Watches, Jewelery & Accessories': 'Watches, Jewelery & Accessories',
      'Excercise & Activewear': 'Excercise & Activewear',
      'Suits & Formalwear': 'Suits & Formalwear',
      'Tops': 'Tops',
      'Bottoms': 'Bottoms',
      'Outerwear': 'Outerwear',
      'Shoes & Boots': 'Shoes & Boots',
      'Other': 'Other'
    },
    'Bags, Wallets, Luggage': {
      'Purses': 'Purses',
      'Luggage': 'Luggage',
      'Satchel/Briefcases': 'Satchel/Briefcases',
      'Other': 'Other'
    },
    'Costumes': {
      'Mens/Womens': 'Mens/Womens',
      'Kids': 'Kids',
      'Makeup/Accessories': 'Makeup/Accessories',
      'Other': 'Other'
    },
    'Uniforms': {
      'School Uniforms': 'School Uniforms',
      'Work Uniforms': 'Work Uniforms',
      'Sports Uniforms': 'Sports Uniforms',
      'Other': 'Other'
    },
    'Other': 'Other'
  },
  'Careers, Jobs & Resumes': {
    'Administrative': 'Administrative',
    'Advertising/PR': 'Advertising/PR',
    'Agents/Dealers': 'Agents/Dealers',
    'Arts/Culture': 'Arts/Culture',
    'Bankers/Brokers': 'Bankers/Brokers',
    'Design/Architecture': 'Design/Architecture',
    'Education/Training': 'Education/Training',
    'Health Care': 'Health Care',
    'IT/Engineering': 'IT/Engineering',
    'Internships': 'Internships',
    'Labour': 'Labour',
    'Legal/Consulting/HR': 'Legal/Consulting/HR',
    'Management': 'Management',
    'Manufacturing': 'Manufacturing',
    'Retail/Wholesale': 'Retail/Wholesale',
    'Sales': 'Sales',
    'Service': 'Service',
    'Social/Nonprofit': 'Social/Nonprofit',
    'Tourism/Travel': 'Tourism/Travel',
    'Transportation': 'Transportation',
    'Other': 'Other'
  },
  'Community, Events & Tickets': {
    'Tickets & Gift Cards': {
      'Food & Travel': 'Food & Travel',
      'Live Music, Theater & Shows': 'Live Music, Theater & Shows',
      'Sports': 'Sports',
      'Other': 'Other'
    },
    'Classes & Lessons': {
      'Music': 'Music',
      'Education & Training': 'Education & Training',
      'Language': 'Language',
      'Other': 'Other'
    },
    'Local Events & Activities': {
      'Music & Theater': 'Music & Theater',
      'Fairs, Festivals & Traveling Shows': 'Fairs, Festivals & Traveling Shows',
      'Food & BBQs': 'Food & BBQs',
      'Sports & Fitness': 'Sports & Fitness',
      'Other': 'Other'
    },
    'Carpool & Ride Share': 'Carpool & Ride Share',
    'Lost & Found': 'Lost & Found',
    'Volunteer Activities': 'Volunteer Activities',
    'Yard & Garage Sales': 'Yard & Garage Sales',
    'Elderly Assistance': 'Elderly Assistance',
    'Pet Sitting': 'Pet Sitting',
    'Babysitter': 'Babysitter',
    'Other': 'Other'
  },
  'Electronics & Computers': {
    'Computers, Laptops & Tablets': {
      'Desktop & Laptop Computers': 'Desktop & Laptop Computers',
      'Computer Parts & Accessories': 'Computer Parts & Accessories',
      'Tablets': 'Tablets',
      'Tablet Parts & Accessories': 'Tablet Parts & Accessories',
      'Computer Monitors': 'Computer Monitors',
      'Servers': 'Servers',
      'Other': 'Other'
    },
    'Game Console': {
      'Handheld & Portable Systems': 'Handheld & Portable Systems',
      'Consoles': 'Consoles',
      'Vintage & Retro Systems': 'Vintage & Retro Systems',
      'Other': 'Other'
    },
    'Home Theater': {
      'Satellite Dished': 'Satellite Dished',
      'Speakers': 'Speakers',
      'Home Theaters': 'Home Theaters',
      'Home Theater Accessories': 'Home Theater Accessories',
      'DVD, Blu-Ray & Disc Players': 'DVD, Blu-Ray & Disc Players',
      'Televisions & projectors': 'Televisions & projectors',
      'Other': 'Other'
    },
    'Phones, Mobile Phones & Music Players': {
      'Home Phones': 'Home Phones',
      'Mobile Phones': 'Mobile Phones',
      'MP3 Players': 'MP3 Players',
      'CD & Tape Players': 'CD & Tape Players',
      'Headphones': 'Headphones',
      'Accessories & Docking Stations': 'Accessories & Docking Stations',
      'Other': 'Other'
    },
    'Camcorders & Cameras': {
      'Cameras': 'Cameras',
      'Lenses': 'Lenses',
      'Bags & Carrying Cases': 'Bags & Carrying Cases',
      'Camcorders': 'Camcorders',
      'Accessories': 'Accessories',
      'Other': 'Other'
    },
    'Other': 'Other'
  },
  'Education & Classes': {
    'Art/Music/Dance': 'Art/Music/Dance',
    'Computers/IT': 'Computers/IT',
    'Language': 'Language',
    'Recreational': 'Recreational',
    'Sports': 'Sports',
    'Tutors': 'Tutors',
    'Other': 'Other'
  },
  'Health & Beauty': {
    'Health & Mobility': {
      'Wheelchairs & Scooters': 'Wheelchairs & Scooters',
      'Canes, Walkers & Crutches': 'Canes, Walkers & Crutches',
      'Chair Lifts': 'Chair Lifts',
      'Ergonomic & Electronic Beds & Chairs': 'Ergonomic & Electronic Beds & Chairs',
      'Other': 'Other'
    },
    'Vanity': {
      'Makeup & Perfume': 'Makeup & Perfume',
      'Wigs & Toupees': 'Wigs & Toupees',
      'Other': 'Other'
    }
  },
  'Hobbies, Crafts & DIY': {
    'Scale Models': {
      'Finished Models': 'Finished Models',
      'Parts & Supplies': 'Parts & Supplies'
    },
    'Sewing, Quilting & Knitting': {
      'Finished Articles': 'Finished Articles',
      'Sewing Machines & Parts': 'Sewing Machines & Parts',
      'Supplies': 'Supplies'
    },
    'Painting & Art': {
      'Finished Artwork': 'Finished Artwork',
      'Equipment & Supplies': 'Equipment & Supplies'
    },
    'Other Crafts & Hobby Supplies': {
      'Boxes, Storage & Organization': 'Boxes, Storage & Organization',
      'Materials & Supplies': 'Materials & Supplies',
      'Other': 'Other'
    },
    'Other': 'Other'
  },
  'Matrimonial': {
    'Bride seeking groom': 'Bride seeking groom',
    'Groom seeking bride': 'Groom seeking bride',
    'Wedding Planners': 'Wedding Planners',
    'Other': 'Other'
  },
  'Music, Movies & Books': {
    'Music': {
      'CDs': 'CDs',
      'Records': 'Records',
      'Other': 'Other'
    },
    'Movies': {
      'VHS': 'VHS',
      'DVD': 'DVD',
      'Blu-Ray': 'Blu-Ray',
      'Other': 'Other'
    },
    'Books': {
      'Text Books': 'Text Books',
      'Comics, Anime & graphic Novels': 'Comics, Anime & graphic Novels',
      'Chapter Books & Novels': 'Chapter Books & Novels',
      'Children\'s Books': 'Children\'s Books',
      'Other': 'Other'
    },
    'Other': 'Other'
  },
  'Musical Instruments': {
    'Keyboards': {
      'Pianos': 'Pianos',
      'Organs': 'Organs',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'String': {
      'Violins': 'Violins',
      'Harps': 'Harps',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'Percussion': {
      'Single Drums & Marching Drums': 'Single Drums & Marching Drums',
      'Drum Kits & Ensembles': 'Drum Kits & Ensembles',
      'Beaters, Sticks & Mallets': 'Beaters, Sticks & Mallets',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'Woodwind': {
      'Flutes': 'Flutes',
      'Clarinets': 'Clarinets',
      'Bagpipes': 'Bagpipes',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'Brass': {
      'Trumpets': 'Trumpets',
      'Horns & Bugles': 'Horns & Bugles',
      'Tubas': 'Tubas',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'Guitars': {
      'Acoustic': 'Acoustic',
      'Electric': 'Electric',
      'Bass': 'Bass',
      'Cases, Stands & Boxes': 'Cases, Stands & Boxes'
    },
    'Amplifiers, Speakers & Distortion': {
      'Amplifiers': 'Amplifiers',
      'Speakers': 'Speakers',
      'Distortion Pedals & Boards': 'Distortion Pedals & Boards'
    },
    'Recording Equipment': 'Recording Equipment',
    'Storage & Transportation': 'Storage & Transportation',
    'Other': 'Other'
  },
  'Pets & Animals': {
    'Birds': {
      'Birds': 'Birds',
      'Food': 'Food',
      'Supplies & Accessories': 'Supplies & Accessories'
    },
    'Cats & Kittens': {
      'Cats & Kittens': 'Cats & Kittens',
      'Toys & Scratching Posts': 'Toys & Scratching Posts',
      'Supplies & Accessories': 'Supplies & Accessories'
    },
    'Dogs & Puppies': {
      'Dogs & Puppies': 'Dogs & Puppies',
      'Supplies & Accessories': 'Supplies & Accessories'
    },
    'Fish & Aquatic Pets': {
      'Fish': 'Fish',
      'Turtles': 'Turtles',
      'Other': 'Other',
      'Supplies & Accessories': 'Supplies & Accessories'
    },
    'Livestock': {
      'Horses': 'Horses',
      'Cattle': 'Cattle',
      'Pigs': 'Pigs',
      'Chickens': 'Chickens',
      'Supplies & Accessories': 'Supplies & Accessories',
      'Other': 'Other'
    },
    'Reptiles & Other': {
      'Snakes': 'Snakes',
      'Lizards': 'Lizards',
      'Bunnies': 'Bunnies',
      'Ferrets': 'Ferrets',
      'Rodents': 'Rodents',
      'Other': 'Other'
    },
    'Cages & Aquariums': 'Cages & Aquariums',
    'Supplies & Accessories': 'Supplies & Accessories'
  },
  'Property & Real-Estate': {
    'Commercial Space': 'Commercial Space',
    'Farm/Ranch': 'Farm/Ranch',
    'Flats': 'Flats',
    'Flat-shares/Rooms': 'Flat-shares/Rooms',
    'Holiday Rentals': 'Holiday Rentals',
    'Houses': 'Houses',
    'Land': 'Land',
    'Offices': 'Offices',
    'Parking': 'Parking',
    'Short Term': 'Short Term',
    'Storage': 'Storage',
    'Vacation Property': 'Vacation Property',
    'Other': 'Other'
  },
  'Services': {
    'Animal/Pet': 'Animal/Pet',
    'Automotive': 'Automotive',
    'Business': 'Business',
    // 'Career/HR': 'Career/HR',
    'Child/Elderly': 'Child/Elderly',
    'Cleaning': 'Cleaning',
    'Computer/Tech': 'Computer/Tech',
    'Contractors & Skilled Trades': 'Contractors & Skilled Trades',
    'Creative/Design': 'Creative/Design',
    // 'Entertainment': 'Entertainment',
    // 'Esoteric': 'Esoteric',
    // 'Event': 'Event',
    'Fitness/Personal Trainers': 'Fitness/Personal Trainers',
    'Health/Beauty': 'Health/Beauty',
    'Hospitality': 'Hospitality',
    'Housekeeping/Janitorial': 'Housekeeping/Janitorial',
    'Lawn/Garden': 'Lawn/Garden',
    'Legal/Financial': 'Legal/Financial',
    'Moving/Storage': 'Moving/Storage',
    // 'Office': 'Office',
    // 'Real Estate': 'Real Estate',
    'Respite/Home Care': 'Respite/Home Care',
    'Sales/Marketing': 'Sales/Marketing',
    // 'Special Events': 'Special Events',
    'Translation': 'Translation',
    'Travel': 'Travel',
    'Tuitions/Lessons': 'Tuitions/Lessons',
    // 'Tutoring & Lessons': 'Tutoring & Lessons',
    // 'Web': 'Web',
    'Other': 'Other'
  },
  'Sports & Active Lifestyle': {
    'Bicycles': {
      'Kids Bikes': 'Kids Bikes',
      'BMX': 'BMX',
      'Mountain': 'Mountain',
      'Road Bikes': 'Road Bikes',
      'Clothing': 'Clothing',
      'Parts & Accessories': 'Parts & Accessories',
      'Other': 'Other'
    },
    'Camping': {
      'Tents': 'Tents',
      'Cooking': 'Cooking',
      'Storage & Coolers': 'Storage & Coolers',
      'Equipment & Accessories': 'Equipment & Accessories'
    },
    'Fishing & Hunting': {
      'Fishing Poles': 'Fishing Poles',
      'Tackle': 'Tackle',
      'Live Bait': 'Live Bait',
      'Fishing Equipment & Accessories': 'Fishing Equipment & Accessories',
      'Clothing': 'Clothing',
      'Guns & Bows': 'Guns & Bows',
      'Hunting Equipment & Accessories': 'Hunting Equipment & Accessories',
      'Hunting Clothes': 'Hunting Clothes'
    },
    'Ball Sports': {
      'Baseball': 'Baseball',
      'Basketball': 'Basketball',
      'Soccer': 'Soccer',
      'Football': 'Football',
      'Other': 'Other'
    },
    'Hockey': {
      'Skates': 'Skates',
      'Padding & Protective Gear': 'Padding & Protective Gear',
      'Other Equipment & Accessories': 'Other Equipment & Accessories'
    },
    'Snow & Winter Sports': {
      'Skis & Snowboards': 'Skis & Snowboards',
      'Equipment & Accessories': 'Equipment & Accessories',
      'Clothing': 'Clothing',
      'Other': 'Other'
    },
    'Paintball': {
      'Markers': 'Markers',
      'Balls, Co2 Tanks, Oxygen Tanks': 'Balls, Co2 Tanks, Oxygen Tanks',
      'Equipment & Accessories': 'Equipment & Accessories',
      'Clothing & Under Armor': 'Clothing & Under Armor',
      'Other': 'Other'
    },
    'Golf': {
      'Clubs': 'Clubs',
      'Bags & Carriers': 'Bags & Carriers',
      'Balls': 'Balls',
      'Shoes & Clothing': 'Shoes & Clothing',
      'Other': 'Other'
    },
    'Excercise Equipment': {
      'Weights': 'Weights',
      'Machines': 'Machines',
      'Universals': 'Universals',
      'Equipment & Accessories': 'Equipment & Accessories',
      'Other': 'Other'
    },
    'Skateboarding & Rollerblades': {
      'Skateboards, Decks, Wheels': 'Skateboards, Decks, Wheels',
      'Rollerblades & Rollerblade Parts': 'Rollerblades & Rollerblade Parts',
      'Equipment & Accessories': 'Equipment & Accessories'
    },
    'Badminton': 'Badminton',
    'Water Sports': 'Water Sports',
    'Other': 'Other'
  },
  'Vehicles': {
    'ATVs & Snowmobiles': {
      'ATVs': 'ATVs',
      'Snowmobile - Parts & Accessories': 'Snowmobile - Parts & Accessories',
      'Other': 'Other'
    },
    'Campers, RVs & Trailers': {
      'Cargo & utility Trailers': 'Cargo & utility Trailers',
      'RVs & Motor Homes': 'RVs & Motor Homes',
      'Travel Trailers & Accessories': 'Travel Trailers & Accessories',
      'Parts & Accessories': 'Parts & Accessories'
    },
    'Cars, Trucks, SUVs, Vans & Crossovers': {
      'Cars': 'Cars',
      'Trucks': 'Trucks',
      'SUVs & Crossovers': 'SUVs & Crossovers',
      'Classic & Antique': 'Classic & Antique',
      'Vans - Passenger': 'Vans - Passenger',
      'Cargo': 'Cargo',
      'Parts & Accessories': 'Parts & Accessories',
      'Other': 'Other'
    },
    'Motorcycles & Mopeds': {
      'Dirt & Moto Cross': 'Dirt & Moto Cross',
      'E-Bikes & Scooters': 'E-Bikes & Scooters',
      'Sport & Street Bikes': 'Sport & Street Bikes',
      'Cruisers, Touring, Choppers': 'Cruisers, Touring, Choppers',
      'Parts & Accessories': 'Parts & Accessories',
      'Other': 'Other'
    },
    'Heavy Equipment': {
      'Farm Equipment': 'Farm Equipment',
      'Trucks': 'Trucks',
      'Parts & Accessories': 'Parts & Accessories',
      'Other': 'Other'
    },
    'Watercraft & Trailers': {
      'Canoes, Kayaks & Paddleboats': 'Canoes, Kayaks & Paddleboats',
      'Power & Motor Boats': 'Power & Motor Boats',
      'Sailboats': 'Sailboats',
      'Personal Watercraft': 'Personal Watercraft',
      'Trailers & Racks': 'Trailers & Racks',
      'Parts & Accessories': 'Parts & Accessories',
      'Other': 'Other'
    }
  },
  'Miscellaneous': 'Miscellaneous'
};

createCategory = function(name) {
  return {
    name: name,
    _id: ObjectId()
  };
};

getMonogoJson = function(json) {
  var cat, categories, category, children;
  categories = [];
  for (cat in json) {
    children = json[cat];
    category = createCategory(cat);
    if (typeof children === 'object') {
      category.children = getMonogoJson(children);
    }
    categories.push(category);
  }
  return categories;
};

db.categories.drop();

db.categories.insert(getMonogoJson(json));

// ---
// generated by coffee-script 1.9.0