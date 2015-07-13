# # This file is responsible for sending an email to all the moderators everyday
# # with list of all the classifieds that have to be reviewed.
# #
# # It sends an email to all moderators as well as CCs the site admins in the
# # mail.
# jade        = require 'jade'
# util        = require 'util'
# async       = require 'async'


# module.exports = ->
#   Config = global.config
#   Classified = global.models.classified
#   User = global.models.user
#   Email = global.modules.email

#   date = new Date()
#   date.setDate date.getDate() - 1

#   getInactiveClassifieds = (callback) ->
#     query = status: Classified.status.INACTIVE
#     Classified.model.find query, callback

#   getNewClassifieds = (callback) ->
#     query = created: $gt: date
#     Classified.model.find query, callback

#   getNewUsers = (callback) ->
#     query = created: $gt: date
#     User.model.find query, callback

#   async.parallel [getInactiveClassifieds, getNewUsers, getNewClassifieds],
#     (error, results) ->
#       if error then return

#       inactiveClassifieds = results[0]
#       newUsers = results[1]
#       newClassifieds = results[2]

#       plainText = 'please use a HTML-enabled mail client to view this mail'
#       subject = 'Daily report'
#       toAddress = Config.email.reportAddress

#       # Render the HTML version of the email
#       template = jade.compileFile "#{global.root}/views/email/daily-report.jade"
#       html = template
#         host: 'https://kuwaitandme.com'
#         inactiveClassifieds: inactiveClassifieds
#         newClassifieds: newClassifieds
#         newUsers: newUsers

#       # Send email report
#       Email.send subject, toAddress, plainText, html
