(function() {
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
      'Other': 'Other'
    },
    'Careers, Jobs & Resumes': {
      'Administrative': 'Administrative',
      'Internships': 'Internships',
      'Service': 'Service',
      'Resumes': 'Resumes',
      'Other': 'Other'
    },
    'Community, Events & Tickets': {
      'Tickets/Gift Cards': {
        'Food & Travel': 'Food & Travel',
        'Live Music, Theater & Shows': 'Live Music, Theater & Shows',
        'Sports': 'Sports',
        'Other': 'Other'
      },
      'Local Events/Activities': {
        'Music & Theater': 'Music & Theater',
        'Fairs, Festivals & Traveling Shows': 'Fairs, Festivals & Traveling Shows',
        'Food & BBQs': 'Food & BBQs',
        'Sports & Fitness': 'Sports & Fitness',
        'Other': 'Other'
      },
      'Lost & Found': 'Lost & Found',
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
      'Phones & Music Players': {
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
    'Furniture & Appliances': {
      "Furniture & Accessories": "Furniture & Accessories",
      "Appliances": "Appliances",
      "Homeware/Decor": "Homeware/Decor",
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
    'Hobbies/Crafts/DIY': {
      'Creative/Crafts': 'Creative/Crafts',
      'Sewing/Quilting/Knitting': {
        'Finished Articles': 'Finished Articles',
        'Sewing Machines & Parts': 'Sewing Machines & Parts',
        'Supplies': 'Supplies'
      },
      'Painting/Art': {
        'Finished Artwork': 'Finished Artwork',
        'Equipment & Supplies': 'Equipment & Supplies'
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
      'Musical Instruments': 'Musical Instruments',
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
    'Pets & Animals': {
      'Birds': {
        'Birds': 'Birds',
        'Food': 'Food',
        'Supplies & Accessories': 'Supplies & Accessories'
      },
      'Cats/Kittens': {
        'Cats & Kittens': 'Cats & Kittens',
        'Toys & Scratching Posts': 'Toys & Scratching Posts',
        'Supplies & Accessories': 'Supplies & Accessories'
      },
      'Dogs/Puppies': {
        'Dogs & Puppies': 'Dogs & Puppies',
        'Supplies & Accessories': 'Supplies & Accessories'
      },
      'Fish/Aquatic Pets': {
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
      'Supplies/Accessories': 'Supplies/Accessories',
      'Others': 'Others'
    },
    'Property & Real-Estate': {
      'Commercial Space': 'Commercial Space',
      'Flats/Rooms': 'Flats/Rooms',
      'Houses': 'Houses',
      'Land': 'Land',
      'Other': 'Other'
    },
    'Services': {
      'Animal/Pet': 'Animal/Pet',
      'Child/Elderly': 'Child/Elderly',
      'Cleaning': 'Cleaning',
      'Contractors': 'Contractors',
      'Design/IT': 'Design/IT',
      'Fitness/Health': 'Fitness/Health',
      'Legal/Business': 'Legal/Business',
      'Moving/Storage': 'Moving/Storage',
      'Sales/Marketing': 'Sales/Marketing',
      'Other': 'Other'
    },
    'Vehicles': {
      'Campers, RVs & Trailers': {
        'Cargo & utility Trailers': 'Cargo & utility Trailers',
        'RVs & Motor Homes': 'RVs & Motor Homes',
        'Travel Trailers & Accessories': 'Travel Trailers & Accessories',
        'Parts & Accessories': 'Parts & Accessories'
      },
      'Cars, Trucks, SUVs & Vans': {
        'Cars': 'Cars',
        'Trucks': 'Trucks',
        'Classic & Antique': 'Classic & Antique',
        'Vans - Passenger': 'Vans - Passenger',
        'Cargo': 'Cargo',
        'Parts & Accessories': 'Parts & Accessories',
        'Other': 'Other'
      },
      'Motorcycles/Bikes': {
        'Dirt & Moto Cross': 'Dirt & Moto Cross',
        'E-Bikes & Scooters': 'E-Bikes & Scooters',
        'Sport & Street Bikes': 'Sport & Street Bikes',
        'Cruisers, Touring, Choppers': 'Cruisers, Touring, Choppers',
        'Parts & Accessories': 'Parts & Accessories',
        'Other': 'Other'
      },
      'Watercraft/Trailers': {
        'Canoes, Kayaks & Paddleboats': 'Canoes, Kayaks & Paddleboats',
        'Power & Motor Boats': 'Power & Motor Boats',
        'Sailboats': 'Sailboats',
        'Personal Watercraft': 'Personal Watercraft',
        'Trailers & Racks': 'Trailers & Racks',
        'Parts & Accessories': 'Parts & Accessories',
        'Other': 'Other'
      },
      'Other': 'Other'
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

}).call(this);

(function() {
  db.locations.drop();

  db.locations.insert([
    {
      name: 'Abdullah Al-Salem'
    }, {
      name: 'Abraq Khaitan'
    }, {
      name: 'Abu Fteira'
    }, {
      name: 'Abu Halifa'
    }, {
      name: 'Adiliya'
    }, {
      name: 'Adān'
    }, {
      name: 'Ahmadi'
    }, {
      name: 'Al-Jabriya'
    }, {
      name: 'Al-Zour'
    }, {
      name: 'Andalus'
    }, {
      name: 'Ardiyah'
    }, {
      name: 'Bayan'
    }, {
      name: 'Bayān'
    }, {
      name: 'Bi-di'
    }, {
      name: 'Bnied Al-Gar'
    }, {
      name: 'Daiya'
    }, {
      name: 'Dasman'
    }, {
      name: 'Doha'
    }, {
      name: 'Fahaheel'
    }, {
      name: 'Faiha'
    }, {
      name: 'Fardaws'
    }, {
      name: 'Farwaniyah'
    }, {
      name: 'Fintās'
    }, {
      name: 'Funaitīs'
    }, {
      name: 'Ghirnata'
    }, {
      name: 'Hadiya'
    }, {
      name: 'Hawally'
    }, {
      name: 'Hittin'
    }, {
      name: 'Jabir al-Ahmad City'
    }, {
      name: 'Jabriya'
    }, {
      name: 'Jahra'
    }, {
      name: 'Jibla'
    }, {
      name: 'Jleeb Al-Shuyoukh'
    }, {
      name: 'Keifan'
    }, {
      name: 'Khaitan'
    }, {
      name: 'Khaldiya'
    }, {
      name: 'Kuwait City'
    }, {
      name: 'Mahboula'
    }, {
      name: 'Maidan Hawalli'
    }, {
      name: 'Mangaf'
    }, {
      name: 'Mansouriya'
    }, {
      name: 'Mirgāb'
    }, {
      name: 'Mishref'
    }, {
      name: 'Misīla'
    }, {
      name: 'Mubarak aj-Jabir suburb'
    }, {
      name: 'Mubarak al-Kabeer'
    }, {
      name: 'Nahdha'
    }, {
      name: 'Nigra'
    }, {
      name: 'Nuzha'
    }, {
      name: 'Omariya'
    }, {
      name: 'Qadsiya'
    }, {
      name: 'Qurain'
    }, {
      name: 'Qurtuba'
    }, {
      name: 'Qusūr'
    }, {
      name: 'Rabiya'
    }, {
      name: 'Rai'
    }, {
      name: 'Rawdah'
    }, {
      name: 'Riqqah'
    }, {
      name: 'Rumaithiya'
    }, {
      name: 'Sabah Al-Nasser'
    }, {
      name: 'Sabah Al-Salem'
    }, {
      name: 'Sabahiyah'
    }, {
      name: 'Sabhān'
    }, {
      name: 'Salhiya'
    }, {
      name: 'Salmiya'
    }, {
      name: 'Salwa'
    }, {
      name: 'Sawābir'
    }, {
      name: 'Sha-ab'
    }, {
      name: 'Shammiya'
    }, {
      name: 'Sharq'
    }, {
      name: 'Shuwaikh'
    }, {
      name: 'Sulaibikhat'
    }, {
      name: 'Surra'
    }, {
      name: 'Udailiya'
    }, {
      name: 'Wafra'
    }, {
      name: 'Yarmūk'
    }
  ]);

}).call(this);
