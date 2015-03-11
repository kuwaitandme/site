module.exports =

	# 'production' or 'development'
	mode: 'development'

	# Client-side JS version
	jsVersion: 15

	# $ openssl rand -base64 32
	sessionSecret: 'FD5Jr0VYt6DZoMzApoEL8TtgrGiM+v3R0Jv9n/Leb/E='

	# See https://github.com/aldipower/nodejs-recaptcha
	reCaptcha:
		enabled: true
		site: '6LcTDQITAAAAADq3-8i6A_YIwuAbpzq9dHJceSem'
		secret: '6LcTDQITAAAAAHUWGVN30aVv-OCfxd3HLKcegNXG'

	# 2checkout for accepting payments
	_2checkout:
		sid: '901265556'
		publicKey: 'CFCDCF7C-9449-46C9-B80A-93DDD9FCEA73'
		privateKey: '4BD65FA7-6A08-4D88-8F15-AFB97A49885F'
		sandbox: true
		# sid: '102419029'
		# publicKey: 'B2F01C56-B648-11E4-8918-73A73A5D4FFE'
		# privateKey: 'B2F01D1E-B648-11E4-8918-73A73A5D4FFE'
		# sandbox: false

	# Redis DB credentials
	redis:
		host: 'localhost'
		port: 6379

	# Mongo DB connection
	mongodb:
		username: 'kuwaitandme'
		password: 'e603ed7dbbc2005a391'

	# Email SMTP settings
	email:
		fromAddress: 'webmaster@kuwaitandme.com'
		reportAddress: 'stevent95@gmail.com, titused@gmail.com'
		smtp:
			username: 'webmaster'
			password: 'aspire5570'
			hostname: 'localhost'
			ssl: false

	# Google Analytics code
	ga: 'UA-41606405-1'