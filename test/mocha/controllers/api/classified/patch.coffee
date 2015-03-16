expect           = require 'expect.js'
supertest        = require 'supertest'

classifiedModel  = global.models.classified
app              = global.app

sampleClassified =
sampleGuestClassified =
testUser =

describe 'patch():', ->
	before (done) ->
		classifiedModel.model.findOne {guest: false}, (err, classified) ->
			sampleClassified = classified

			classifiedModel.model.findOne {guest: true}, (err, classified) ->
				sampleGuestClassified = classified
				done()

	describe 'check for access based on id and request.data:', ->
		it 'if id is missing return 404', (done) ->
			supertest app
			.patch '/api/classified/'

			.expect '"need id"'
			.expect 404, done


		it 'if id is invalid return 400', (done) ->
			supertest app
			.patch '/api/classified/i-dont-exist'

			.expect '"invalid id"'
			.expect 400, done


		it 'if valid id but invalid parameters return 412', (done) ->
			supertest app
			.patch '/api/classified/111111111111111111111111'

			.expect '"patch only specific parameters"'
			.expect 412, done


		it 'if invalid id but valid parameters (status) return 404', (done) ->
			supertest app
			.patch '/api/classified/550587ae4171903c37309911'
			.send {status: 0}

			.expect 404, done


		it 'if invalid id but valid parameters (report) return 404', (done) ->
			supertest app
			.patch '/api/classified/550587ae4171903c37309911'
			.send {reports: []}

			.expect 404, done


		it 'if invalid id but valid parameters (perk) return 404', (done) ->
			supertest app
			.patch '/api/classified/550587ae4171903c37309911'
			.send {perks: []}

			.expect 404, done


	describe 'for a valid id of a guest classified:', ->
		it 'if authHash is missing return 401', (done) ->
			cl = sampleGuestClassified
			supertest app
			.patch "/api/classified/#{cl._id}"
			.send {status: 0}

			.expect '"unauthorized"'
			.expect 401, done


		describe 'for requests where authHash is set', ->
			it 'if attempting to set status ACTIVE return 401', (done) ->
				cl = sampleGuestClassified
				supertest app
				.patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
				.send {status: classifiedModel.status.ACTIVE}
				.expect '"only a moderator can set that status"'
				.expect 401, done


			it 'if attempting to set status REJECTED return 401', (done) ->
				cl = sampleGuestClassified
				supertest app
				.patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
				.send {status: classifiedModel.status.REJECTED}
				.expect '"only a moderator can set that status"'
				.expect 401, done


			it 'if attempting to set status BANNED return 401', (done) ->
				cl = sampleGuestClassified
				supertest app
				.patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
				.send {status: classifiedModel.status.BANNED}
				.expect '"only a moderator can set that status"'
				.expect 401, done


			it 'if attempting to set status ARCHIVED return 200', (done) ->
				cl = sampleGuestClassified
				cl.status = classifiedModel.status.ARCHIVED

				supertest app
				.patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
				.send {status: cl.status}
				.expect JSON.stringify cl
				.expect 200, done


			it 'if attempting to set status INACTIVE return 200', (done) ->
				cl = sampleGuestClassified
				cl.status = classifiedModel.status.INACTIVE

				supertest app
				.patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
				.send {status: cl.status}
				.expect JSON.stringify cl
				.expect 200, done


	describe 'for a valid id of a non-guest classified:', ->
		describe 'if no user is logged in:', ->
			it 'if attempting to set status ACTIVE return 401', (done) ->
				cl = sampleClassified
				cl.status = classifiedModel.status.ACTIVE

				supertest app
				.patch "/api/classified/#{cl._id}"
				.send {status: cl.status}
				.expect '"unauthorized"'
				.expect 401, done


			it 'if attempting to set status REJECTED return 401', (done) ->
				cl = sampleClassified
				cl.status = classifiedModel.status.REJECTED

				supertest app
				.patch "/api/classified/#{cl._id}"
				.send {status: cl.status}
				.expect '"unauthorized"'
				.expect 401, done


			it 'if attempting to set status INACTIVE return 401', (done) ->
				cl = sampleClassified
				cl.status = classifiedModel.status.INACTIVE

				supertest app
				.patch "/api/classified/#{cl._id}"
				.send {status: cl.status}
				.expect '"unauthorized"'
				.expect 401, done


			it 'if attempting to set status BANNED return 401', (done) ->
				cl = sampleClassified
				cl.status = classifiedModel.status.BANNED

				supertest app
				.patch "/api/classified/#{cl._id}"
				.send {status: cl.status}
				.expect '"unauthorized"'
				.expect 401, done

			it 'if attempting to set status ARCHIVED return 401', (done) ->
				cl = sampleClassified
				cl.status = classifiedModel.status.ARCHIVED

				supertest app
				.patch "/api/classified/#{cl._id}"
				.send {status: cl.status}
				.expect '"unauthorized"'
				.expect 401, done


		describe 'if user is logged in:', ->
			describe 'user is not owner and not a moderator:', ->
				before (done) ->
					testUser = supertest.agent 'http://kme.com'
					testUser.post '/api/auth/login'
					.send({ username: 'a@mail.com', password: 'pass' })
					.expect 200, done

				it 'if attempting to set status ACTIVE return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"unauthorized"'
					.expect 401, done


				it 'if attempting to set status REJECTED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.REJECTED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"unauthorized"'
					.expect 401, done


				it 'if attempting to set status INACTIVE return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.INACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"unauthorized"'
					.expect 401, done


				it 'if attempting to set status BANNED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.BANNED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"unauthorized"'
					.expect 401, done


				it 'if attempting to set status ARCHIVED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ARCHIVED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"unauthorized"'
					.expect 401, done


			describe 'user is owner but not a moderator:', ->
				before (done) ->
					classifiedModel.model.findOne {_id: sampleClassified._id}, (err, classified) ->
						classified.status = classifiedModel.status.ACTIVE
						sampleClassified = classified

						classified.save ->
							testUser = supertest.agent 'http://kme.com'
							testUser.post '/api/auth/login'
							.send({ username: 'jon@mail.com', password: 'pass' })
							.expect 200, done

				it 'if attempting to set status ACTIVE return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				it 'if attempting to set status REJECTED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.REJECTED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"only a moderator can set that status"'
					.expect 401, done


				it 'if attempting to set status INACTIVE return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.INACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"only a moderator can set that status"'
					.expect 401, done


				it 'if attempting to set status BANNED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.BANNED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"only a moderator can set that status"'
					.expect 401, done

				it 'if attempting to set status ARCHIVED return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ARCHIVED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				describe 'if classified status is BANNED', ->
					before (done) ->
						classifiedModel.model.findOne {_id: sampleClassified._id}, (err, classified) ->
							classified.status = classifiedModel.status.BANNED
							sampleClassified = classified
							classified.save done


					it 'if attempting to set status ACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done


					it 'if attempting to set status REJECTED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.REJECTED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status INACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.INACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status BANNED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.BANNED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done

					it 'if attempting to set status ARCHIVED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ARCHIVED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done


				describe 'if classified status is REJECTED', ->
					before (done) ->
						classifiedModel.model.findOne {_id: sampleClassified._id}, (err, classified) ->
							classified.status = classifiedModel.status.REJECTED
							sampleClassified = classified
							classified.save done


					it 'if attempting to set status ACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done


					it 'if attempting to set status REJECTED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.REJECTED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status INACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.INACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status BANNED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.BANNED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done

					it 'if attempting to set status ARCHIVED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ARCHIVED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done

				describe 'if classified status is FLAGGED', ->
					before (done) ->
						classifiedModel.model.findOne {_id: sampleClassified._id}, (err, classified) ->
							classified.status = classifiedModel.status.FLAGGED
							sampleClassified = classified
							classified.save done


					it 'if attempting to set status ACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done


					it 'if attempting to set status REJECTED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.REJECTED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status INACTIVE return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.INACTIVE

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done


					it 'if attempting to set status BANNED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.BANNED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"only a moderator can set that status"'
						.expect 401, done

					it 'if attempting to set status ARCHIVED return 401', (done) ->
						cl = sampleClassified
						cl.status = classifiedModel.status.ARCHIVED

						testUser
						.patch "/api/classified/#{cl._id}"
						.send {status: cl.status}
						.expect '"unauthorized to change classified\'s status"'
						.expect 401, done

			describe 'user is a moderator:', ->
				before (done) ->
					testUser = supertest.agent 'http://kme.com'
					testUser.post '/api/auth/login'
					.send({ username: 'admin@mail.com', password: 'pass' })
					.expect 200, done

				it 'if attempting to set status ACTIVE return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				it 'if attempting to set status REJECTED return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.REJECTED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				it 'if attempting to set status INACTIVE return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.INACTIVE

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				it 'if attempting to set status BANNED return 200', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.BANNED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect JSON.stringify cl
					.expect 200, done


				it 'if attempting to set status ARCHIVED return 401', (done) ->
					cl = sampleClassified
					cl.status = classifiedModel.status.ARCHIVED

					testUser
					.patch "/api/classified/#{cl._id}"
					.send {status: cl.status}
					.expect '"moderators should not archive a classified"'
					.expect 401, done