/* Categories */
db.categories.drop();
db.categories.insert([
{
	_id: ObjectId(),
	name: 'Apparel, Jewelery & Accessories',
	children: [
		{
			_id: ObjectId(),
			name: "Kids",
			children: [
				{ _id: ObjectId(), name: "Clothing 2T-5T" },
				{ _id: ObjectId(), name: "Clothing 6+" },
				{ _id: ObjectId(), name: "Accessories & Jewelery" },
				{ _id: ObjectId(), name: "Outer Wear" },
				{ _id: ObjectId(), name: "Shoes & boots" },
				{ _id: ObjectId(), name: "Other" },
			]
		}, {
			_id: ObjectId(),
			name: "Womens",
			children: [
				{ _id: ObjectId(), name: "Dresses & Skirts" },
				{ _id: ObjectId(), name: "Excercise & Activewear" },
				{ _id: ObjectId(), name: "Hats & Accessories" },
				{ _id: ObjectId(), name: "Jewelery" },
				{ _id: ObjectId(), name: "Tops" },
				{ _id: ObjectId(), name: "Bottoms" },
				{ _id: ObjectId(), name: "Maternity Clothes" },
				{ _id: ObjectId(), name: "Outerwear" },
				{ _id: ObjectId(), name: "Shoes & Boots" },
				{ _id: ObjectId(), name: "Wedding Dresses" },
				{ _id: ObjectId(), name: "Other" },
			]
		}, {
			_id: ObjectId(),
			name: "Mens",
			children: [
				{ _id: ObjectId(), name: "Watches, Jewelery & Accessories" },
				{ _id: ObjectId(), name: "Excercise & Activewear" },
				{ _id: ObjectId(), name: "Suits & Formalwear" },
				{ _id: ObjectId(), name: "Tops" },
				{ _id: ObjectId(), name: "Bottoms" },
				{ _id: ObjectId(), name: "Outerwear" },
				{ _id: ObjectId(), name: "Shoes & Boots" },
				{ _id: ObjectId(), name: "Other" },
			]
		}, {
			_id: ObjectId(),
			name: "Bags, Wallets, Luggage",
			children: [
				{ _id: ObjectId(), name: "Purses" },
				{ _id: ObjectId(), name: "Luggage" },
				{ _id: ObjectId(), name: "Satchel/Briefcases" },
				{ _id: ObjectId(), name: "Other" },
			]
		}, {
			_id: ObjectId(),
			name: "Costumes",
			children: [
				{ _id: ObjectId(), name: "Mens/Womens" },
				{ _id: ObjectId(), name: "Kids" },
				{ _id: ObjectId(), name: "Makeup/Accessories" },
				{ _id: ObjectId(), name: "Other" },
			]
		}, {
			_id: ObjectId(),
			name: "Uniforms",
			children: [
				{ _id: ObjectId(), name: "School Uniforms" },
				{ _id: ObjectId(), name: "Work Uniforms" },
				{ _id: ObjectId(), name: "Sports Uniforms" },
				{ _id: ObjectId(), name: "Other" },
			]
		}
	]
}, {
	name: 'Careers, Jobs & Resumes',
	children: [
		{ _id: ObjectId(), name: 'Administrative' },
		{ _id: ObjectId(), name: 'Advertising/PR' },
		{ _id: ObjectId(), name: 'Agents/Dealers' },
		{ _id: ObjectId(), name: 'Arts/Culture' },
		{ _id: ObjectId(), name: 'Bankers/Brokers' },
		{ _id: ObjectId(), name: 'Design/Architecture' },
		{ _id: ObjectId(), name: 'Education/Training' },
		{ _id: ObjectId(), name: 'Health Care' },
		{ _id: ObjectId(), name: 'IT/Engineering' },
		{ _id: ObjectId(), name: 'Internships' },
		{ _id: ObjectId(), name: 'Labour' },
		{ _id: ObjectId(), name: 'Legal/Consulting/HR' },
		{ _id: ObjectId(), name: 'Management' },
		{ _id: ObjectId(), name: 'Manufacturing' },
		{ _id: ObjectId(), name: 'Retail/Wholesale' },
		{ _id: ObjectId(), name: 'Sales' },
		{ _id: ObjectId(), name: 'Service' },
		{ _id: ObjectId(), name: 'Social/Nonprofit' },
		{ _id: ObjectId(), name: 'Tourism/Travel' },
		{ _id: ObjectId(), name: 'Transportation' },
		{ _id: ObjectId(), name: 'Other' }
	]
},{
	name: 'Community, Events & Tickets',
	children: [{
		_id: ObjectId(),
		name: "Tickets & Gift Cards"
		children: [
			{ _id: ObjectId(), name: "Food & Travel" },
			{ _id: ObjectId(), name: "Live Music, Theater & Shows" },
			{ _id: ObjectId(), name: "Sports" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		_id: ObjectId(),
		name: "Classes & Lessons",
		children: [
			{ _id: ObjectId(), name: "Music" },
			{ _id: ObjectId(), name: "Education & Training" },
			{ _id: ObjectId(), name: "Language" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		_id: ObjectId(),
		name: "Local Events & Activities"
		children: [
			{ _id: ObjectId(), name: "Music & Theater" },
			{ _id: ObjectId(), name: "Fairs, Festivals & Travelling Shows" },
			{ _id: ObjectId(), name: "Food & BBQs" },
			{ _id: ObjectId(), name: "Sports & Fitness" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		_id: ObjectId(),
		name: "Carpool & Ride Share"
	}, {
		_id: ObjectId(),
		name: "Lost & Found"
	}, {
		_id: ObjectId(),
		name: "Volunteer Activities"
	}, {
		_id: ObjectId(),
		name: "Yard & Garage Sales"
	}, {
		_id: ObjectId(),
		name: "Elderly Assistance"
	}, {
		_id: ObjectId(),
		name: "Pet Sitting"
	}, {
		_id: ObjectId(),
		name: "Babysitter"
	}, {
		_id: ObjectId(),
		name: "Other"
	}]
}, {
	name: 'Electronics & Computers',
	children: [{
		name: "Computers, Laptops & Tablets",
		children: [
			{ _id: ObjectId(), name: "Desktop & Laptop Computers" },
			{ _id: ObjectId(), name: "Computer Parts & Accessories" },
			{ _id: ObjectId(), name: "Tablets" },
			{ _id: ObjectId(), name: "Tablet Parts & Accessories" },
			{ _id: ObjectId(), name: "Computer Monitors" },
			{ _id: ObjectId(), name: "Servers" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		name: "Game Console",
		children: [
			{ _id: ObjectId(), name: "Handheld & Portable Systems" },
			{ _id: ObjectId(), name: "Consoles" },
			{ _id: ObjectId(), name: "Vintage & Retro Systems" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		name: "Home Theater",
		children: [
			{ _id: ObjectId(), name: "Satellite Dished" },
			{ _id: ObjectId(), name: "Speakers" },
			{ _id: ObjectId(), name: "Home Theaters" },
			{ _id: ObjectId(), name: "Home Theater Accessories" },
			{ _id: ObjectId(), name: "DVD, Blu-Ray & Disc Players" },
			{ _id: ObjectId(), name: "Televisions & projectors" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		name: "Phones, Mobile Phones & Music Players",
		children: [
			{ _id: ObjectId(), name: "Home Phones" },
			{ _id: ObjectId(), name: "Mobile Phones" },
			{ _id: ObjectId(), name: "MP3 Players" },
			{ _id: ObjectId(), name: "CD & Tape Players" },
			{ _id: ObjectId(), name: "Headphones" },
			{ _id: ObjectId(), name: "Accessories & Docking Stations" },
			{ _id: ObjectId(), name: "Other" },
		]
	}, {
		name: "Camcorders & Cameras",
		children: [
			{ _id: ObjectId(), name: "Cameras" },
			{ _id: ObjectId(), name: "Lenses" },
			{ _id: ObjectId(), name: "Bags & Carrying Cases" },
			{ _id: ObjectId(), name: "Camcorders" },
			{ _id: ObjectId(), name: "Accessories" },
			{ _id: ObjectId(), name: "Other" },
		]
	}]
}, {
	name: 'Education & Classes',
	children: [
		{ _id: ObjectId(), name: 'Art/Music/Dance' },
		{ _id: ObjectId(), name: 'Computers/IT' },
		{ _id: ObjectId(), name: 'Language' },
		{ _id: ObjectId(), name: 'Recreational' },
		{ _id: ObjectId(), name: 'Sports' },
		{ _id: ObjectId(), name: 'Tutors' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
// 	name: 'General Items',
// 	children: [
// 		{ _id: ObjectId(), name: 'Art' },
// 		{ _id: ObjectId(), name: 'Accessories' },
// 		{ _id: ObjectId(), name: 'Baby/Kids items' },
// 		{ _id: ObjectId(), name: 'Bicycles' },
// 		{ _id: ObjectId(), name: 'Books' },
// 		{ _id: ObjectId(), name: 'Industrial' },
// 		{ _id: ObjectId(), name: 'CDs/DVDs/Records' },
// 		{ _id: ObjectId(), name: 'Clothing' },
// 		{ _id: ObjectId(), name: 'Collectibles' },
// 		{ _id: ObjectId(), name: 'Software' },
// 		{ _id: ObjectId(), name: 'Furniture' },
// 		{ _id: ObjectId(), name: 'Gaming' },
// 		{ _id: ObjectId(), name: 'Health/Beauty' },
// 		{ _id: ObjectId(), name: 'Hobbies/Crafts' },
// 		{ _id: ObjectId(), name: 'Home Appliances' },
// 		{ _id: ObjectId(), name: 'Home/Garden' },
// 		{ _id: ObjectId(), name: 'Household' },
// 		{ _id: ObjectId(), name: 'Jewelery' },
// 		{ _id: ObjectId(), name: 'Mobile Phones' },
// 		{ _id: ObjectId(), name: 'Musical' },
// 		{ _id: ObjectId(), name: 'Sporting/Exercise' },
// 		{ _id: ObjectId(), name: 'Tickets' },
// 		{ _id: ObjectId(), name: 'Toys/Games' },
// 		{ _id: ObjectId(), name: 'Other' },
// 	]
// }, {
	name: 'Housing',
	children: [
		{ _id: ObjectId(), name: 'Commercial Space' },
		{ _id: ObjectId(), name: 'Farm/Ranch' },
		{ _id: ObjectId(), name: 'Flats' },
		{ _id: ObjectId(), name: 'Flat-shares/Rooms' },
		{ _id: ObjectId(), name: 'Holiday Rentals' },
		{ _id: ObjectId(), name: 'Houses' },
		{ _id: ObjectId(), name: 'Land' },
		{ _id: ObjectId(), name: 'Offices' },
		{ _id: ObjectId(), name: 'Parking' },
		{ _id: ObjectId(), name: 'Short Term' },
		{ _id: ObjectId(), name: 'Storage' },
		{ _id: ObjectId(), name: 'Vacation Property' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
	name: 'Matrimonial',
	children: [
		{ _id: ObjectId(), name: 'Bride seeking groom' },
		{ _id: ObjectId(), name: 'Groom seeking bride' },
		{ _id: ObjectId(), name: 'Wedding Planners' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
	name: 'Pets',
	children: [
		{ _id: ObjectId(), name: 'Cats/kittens' },
		{ _id: ObjectId(), name: 'Dogs/puppies' },
		{ _id: ObjectId(), name: 'Birds' },
		{ _id: ObjectId(), name: 'Exotics' },
		{ _id: ObjectId(), name: 'Fish' },
		{ _id: ObjectId(), name: 'Accessories' },
		{ _id: ObjectId(), name: 'Supplies' },
		{ _id: ObjectId(), name: 'Lost Pets' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
	name: 'Services',
	children: [
		{ _id: ObjectId(), name: 'Automotive' },
		{ _id: ObjectId(), name: 'Animal/Pet' },
		{ _id: ObjectId(), name: 'Business' },
		{ _id: ObjectId(), name: 'Career/HR' },
		{ _id: ObjectId(), name: 'Child/Elderly' },
		{ _id: ObjectId(), name: 'Cleaning' },
		{ _id: ObjectId(), name: 'Computer/Tech' },
		{ _id: ObjectId(), name: 'Construction' },
		{ _id: ObjectId(), name: 'Creative/Design' },
		{ _id: ObjectId(), name: 'Esoteric' },
		{ _id: ObjectId(), name: 'Event' },
		{ _id: ObjectId(), name: 'Health/Beauty' },
		{ _id: ObjectId(), name: 'Home' },
		{ _id: ObjectId(), name: 'Financial' },
		{ _id: ObjectId(), name: 'Lawn/Garden' },
		{ _id: ObjectId(), name: 'Legal' },
		{ _id: ObjectId(), name: 'Moving/Storage' },
		{ _id: ObjectId(), name: 'Office' },
		{ _id: ObjectId(), name: 'Real Estate' },
		{ _id: ObjectId(), name: 'Translation' },
		{ _id: ObjectId(), name: 'Travel' },
		{ _id: ObjectId(), name: 'Tuitions/Lessons' },
		{ _id: ObjectId(), name: 'Web' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
	name: 'Vehicles',
	children: [
		{ _id: ObjectId(), name: 'Accessories' },
		{ _id: ObjectId(), name: 'Aircraft ' },
		{ _id: ObjectId(), name: 'Bikes' },
		{ _id: ObjectId(), name: 'Boats' },
		{ _id: ObjectId(), name: 'Caravans' },
		{ _id: ObjectId(), name: 'Cars' },
		{ _id: ObjectId(), name: 'Classics Cars' },
		{ _id: ObjectId(), name: 'Construction' },
		{ _id: ObjectId(), name: 'Exotics' },
		{ _id: ObjectId(), name: 'Family' },
		{ _id: ObjectId(), name: 'Heavy Equipment' },
		{ _id: ObjectId(), name: 'Trucks/Lorries' },
		{ _id: ObjectId(), name: 'Other' }
	]
}, {
	name: 'Miscellaneous'
}]);


/* Locations */
db.locations.drop();
db.locations.insert([
	{ name: 'Abdullah Al-Salem' },
	{ name: 'Abraq Khaitan' },
	{ name: 'Abu Fteira' },
	{ name: 'Abu Halifa' },
	{ name: 'Adiliya' },
	{ name: 'Adān' },
	{ name: 'Ahmadi' },
	{ name: 'Al-Jabriya' },
	{ name: 'Al-Zour' },
	{ name: 'Andalus' },
	{ name: 'Ardiyah' },
	{ name: 'Bayan' },
	{ name: 'Bayān' },
	{ name: 'Bi-di' },
	{ name: 'Bnied Al-Gar' },
	{ name: 'Daiya' },
	{ name: 'Dasman' },
	{ name: 'Doha' },
	{ name: 'Fahaheel' },
	{ name: 'Faiha' },
	{ name: 'Fardaws' },
	{ name: 'Farwaniyah' },
	{ name: 'Fintās' },
	{ name: 'Funaitīs' },
	{ name: 'Ghirnata' },
	{ name: 'Hadiya' },
	{ name: 'Hawally' },
	{ name: 'Hittin' },
	{ name: 'Jabir al-Ahmad City' },
	{ name: 'Jabriya' },
	{ name: 'Jahra' },
	{ name: 'Jibla' },
	{ name: 'Jleeb Al-Shuyoukh' },
	{ name: 'Keifan' },
	{ name: 'Khaitan' },
	{ name: 'Khaldiya' },
	{ name: 'Kuwait City' },
	{ name: 'Mahboula' },
	{ name: 'Maidan Hawalli' },
	{ name: 'Mangaf' },
	{ name: 'Mansouriya' },
	{ name: 'Mirgāb' },
	{ name: 'Mishref' },
	{ name: 'Misīla' },
	{ name: 'Mubarak aj-Jabir suburb' },
	{ name: 'Mubarak al-Kabeer' },
	{ name: 'Nahdha' },
	{ name: 'Nigra' },
	{ name: 'Nuzha' },
	{ name: 'Omariya' },
	{ name: 'Qadsiya' },
	{ name: 'Qurain' },
	{ name: 'Qurtuba' },
	{ name: 'Qusūr' },
	{ name: 'Rabiya' },
	{ name: 'Rai' },
	{ name: 'Rawdah' },
	{ name: 'Riqqah' },
	{ name: 'Rumaithiya' },
	{ name: 'Sabah Al-Nasser' },
	{ name: 'Sabah Al-Salem' },
	{ name: 'Sabahiyah' },
	{ name: 'Sabhān' },
	{ name: 'Salhiya' },
	{ name: 'Salmiya' },
	{ name: 'Salwa' },
	{ name: 'Sawābir' },
	{ name: 'Sha-ab' },
	{ name: 'Shammiya' },
	{ name: 'Sharq' },
	{ name: 'Shuwaikh' },
	{ name: 'Sulaibikhat' },
	{ name: 'Surra' },
	{ name: 'Udailiya' },
	{ name: 'Wafra' },
	{ name: 'Yarmūk' },
]);