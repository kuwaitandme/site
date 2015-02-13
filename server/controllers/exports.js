module.exports = {
	auth: {
		guest: require('./auth/guest'),
		login: require('./auth/login'),
		logout: require('./auth/logout'),
		signup: require('./auth/signup')
	},
	classified: {
		post: require('./classified/post'),
		search: require('./classified/search'),
		single: require('./classified/single')
	},
	guest: {
		finish: require('./guest/finish'),
		post: require('./guest/post'),
		single: require('./guest/single')
	},
	landing: require('./index/landing'),
	privacy: require('./index/privacy'),
	terms: require('./index/terms')
}