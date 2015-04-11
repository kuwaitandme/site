(function() {
  var createCategory, getMonogoJson, json;

  json = {
    'General Items': {
      'Baby Items': 'Baby Items',
      'Beauty & Health': 'Beauty & Health',
      'Clothing & Accessories': 'Clothing & Accessories',
      'Furniture & Decor': 'Furniture & Decor',
      'Home Appliances': 'Home Appliances',
      'Jewelery & Watches': 'Jewelery & Watches',
      'Sports & Exercise': 'Sports & Exercise',
      'Toys & Games': 'Toys & Games',
      'Other': 'Other'
    },
    'Careers & Jobs': {
      'Administrative': 'Administrative',
      'Internships': 'Internships',
      'Service': 'Service',
      'Resumes': 'Resumes',
      'Other': 'Other'
    },
    'Community & Events': {
      'Carpool & Ride Share': 'Carpool & Ride Share',
      'Local Events & Activities': 'Local Events & Activities',
      'Lost & Found': 'Lost & Found',
      'Tickets & Gift Cards': 'Tickets & Gift Cards',
      'Volunteer Activities': 'Volunteer Activities',
      'Yard & Garage Sales': 'Yard & Garage Sales',
      'Other': 'Other'
    },
    'Matrimonial': {
      'Bride seeking groom': 'Bride seeking groom',
      'Groom seeking bride': 'Groom seeking bride',
      'Wedding Planners': 'Wedding Planners',
      'Other': 'Other'
    },
    'Electronics & Computers': {
      'Camcorders & Cameras': 'Camcorders & Cameras',
      'Computers & Laptops': 'Computers & Laptops',
      'Gaming': 'Gaming',
      'Phones & Tablets': 'Phones & Tablets',
      'Headphones & MP3': 'Headphones & MP3',
      'Television & Home Theater': 'Television & Home Theater',
      'Video Games & Software': 'Video Games & Software',
      'Other': 'Other'
    },
    'Property & Real-Estate': {
      'Commercial Space': 'Commercial Space',
      'Flats & Rooms': 'Flats & Rooms',
      'Houses': 'Houses',
      'Land': 'Land',
      'Other': 'Other'
    },
    'Hobbies, Crafts & DIY': {
      'Art & Collectibles': 'Art & Collectibles',
      'Creative & Crafts': 'Creative & Crafts',
      'Painting & Art': 'Painting & Art',
      'Sewing & Quilting & Knitting': 'Sewing & Quilting & Knitting',
      'Other': 'Other'
    },
    'Music, Movies & Books': {
      'Books': 'Books',
      'Instruments': 'Instruments',
      'Movies': 'Movies',
      'Music': 'Music',
      'Other': 'Other'
    },
    'Vehicles': {
      'Campers, RVs & Trailers': 'Campers, RVs & Trailers',
      'Cars, Trucks, SUVs & Vans': 'Cars, Trucks, SUVs & Vans',
      'Motorcycles & Bikes': 'Motorcycles & Bikes',
      'Watercraft & Trailers': 'Watercraft & Trailers',
      'Other': 'Other'
    },
    'Services': {
      'Animal & Pet': 'Animal & Pet',
      'Child & Elderly': 'Child & Elderly',
      'Cleaning': 'Cleaning',
      'Contractors': 'Contractors',
      'Design & IT': 'Design & IT',
      'Education & Classes': 'Education & Classes',
      'Fitness & Health': 'Fitness & Health',
      'Legal & Business': 'Legal & Business',
      'Moving & Storage': 'Moving & Storage',
      'Sales & Marketing': 'Sales & Marketing',
      'Other': 'Other'
    },
    'Pets & Animals': {
      'Birds': 'Birds',
      'Cats & Kittens': 'Cats & Kittens',
      'Dogs & Puppies': 'Dogs & Puppies',
      'Fish & Aquatic Pets': 'Fish & Aquatic Pets',
      'Livestock': 'Livestock',
      'Supplies & Accessories': 'Supplies & Accessories',
      'Others': 'Others'
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
