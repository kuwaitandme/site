expect           = require 'expect.js'
supertest        = require 'supertest'

app = global.app
classifiedModel  = global.models.classified

sampleClassified = null

describe 'get():', ->
	it 'don\'t fetch a classified with invalid id', (done) ->
		supertest(app)
			.get('/api/classified/5501d$#d4502fd9d4a28@8Z4')
			.expect(404, done)

	it 'don\'t fetch a classified without the id', (done) ->
		supertest(app)
			.get('/api/classified/')
			.expect(404, done)

	it 'don\'t fetch a classified without a non-existent id', (done) ->
		supertest(app)
			.get('/api/classified/111111111111111111111111')
			.expect(404, done)

	it 'fetch a classified with a existent id', (done) ->
		supertest(app)
			.get('/api/classified/5501d76d4502fd9d4a2868e4')
			.expect('{"_id":"5501d76d4502fd9d4a2868e4","guest":true,"status":0,"authHash":"6df3c780-1cef-2fd0-3547-dc6233869400","views":0,"created":"2015-03-12T18:14:05.011Z","type":0,"title":"A test title","price":123,"description":"description goes here","category":"54e0edd16bbf4aa24bb3b7c0","__v":0,"meta":{"gmapY":123,"gmapX":123},"contact":{"phone":"9123123123","location":"54e0edd16bbf4aa24bb3b7c0","email":"a@mail.com","address2":"Address line 2","address1":"Address line 1"},"perks":{"urgent":false,"promote":false},"reports":[],"images":[]}')
			.expect(200, done)