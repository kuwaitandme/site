# This file is responsible for sending an email to all the moderators everyday
# with list of all the classifieds that have to be reviewed.
#
# It sends an email to all moderators as well as CCs the site admins in the
# mail.
jade        = require 'jade'
util        = require 'util'

module.exports = ->
  Config = global.config
  Classified = global.models.classified
  Email = global.controllers.helpers.email

  # Find all inactive classifieds
  Classified.model.find {status: Classified.status.INACTIVE}, (err, classifieds) ->
    if err then return err

    # Don't send the report if there are no unpublished classifieds
    if classifieds.length == 0 then return

    # Prepare the plain-text body
    text = ""
    for cl in classifieds
      text += util.format "%s\n\t%s\n\n", cl.title, "http://kuwaitandme.com/classified/#{cl._id}"

    # Render the HTML version of the email
    template = jade.compileFile "#{global.root}/views/email/daily-report.jade"
    html = template
      classifieds: classifieds
      users: users
      host: 'https://kuwaitandme.com'

    subject = 'Daily report'
    plaintext = text
    toAddress = Config.email.reportAddress

    # Send email report
    Email.send subject, toAddress, plaintext, html