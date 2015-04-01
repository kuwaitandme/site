email = require 'emailjs'
fs    = require 'fs'
jade  = require 'jade'

config = global.config

module.exports =
  sendTemplate: (senderAddress, template, options) ->
    if not config.email.enabled then return

    emailRoot = "#{global.root}/../server/views/email"
    options.host = config.email.host

    # Render the plain-text version of the email
    plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
    plainText = plainTextTemplate options

    # Render the HTML version of the email
    htmlTemplate = jade.compileFile "#{emailRoot}/#{template}.jade"
    html = htmlTemplate options

    # Finally send the email
    @send options.subject, plainText, senderAddress, html


  send: (subject, plainText, senderAddress, html) ->
    if not config.email.enabled then return

    # Connect to the SMTP server
    server = email.server.connect
      user: config.email.smtp.username
      password: config.email.smtp.password
      host: config.email.smtp.hostname
      ssl: config.email.smtp.ssl

    # Start sending the message
    server.send
      attachment: [ {
        data: html
        alternative: true
      } ]
      from: config.email.fromAddress
      subject: 'Kuwait & Me - ' + subject
      text: plainText
      to: senderAddress