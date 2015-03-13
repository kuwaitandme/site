expect           = require 'expect.js'
classifiedModel  = global.models.classified

sampleClassified = null

describe 'post():', ->
	describe 'update various properties in a classified', ->
		describe 'update classified statuses', ->
			it 'change status to REJECTED as owner', ->
			it 'change status to REJECTED as anonymous', ->
			it 'change status to REJECTED as moderator', ->

		describe 'update classified fields with empty values', ->
			it 'reject for empty email', ->

		describe 'update classified fields with invalid values', ->
			it 'reject for bad email', ->

		describe 'update classified images', ->
			it 'delete previous images', ->
			it 'add new images', ->
			it 'delete and add new images', ->