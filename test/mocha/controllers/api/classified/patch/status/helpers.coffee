expect           = require 'expect.js'
supertest        = require 'supertest'
classifiedModel  = global.models.classified

module.exports = (cl, user, newStatus, resCode, resText, done) ->
  cl.status = classifiedModel.status[newStatus] or newStatus
  user
  .patch "/api/classified/#{cl._id}?authHash=#{cl.authHash}"
  .send status: cl.status
  .expect resText or JSON.stringify cl
  .expect resCode, done