email = require 'emailjs'
fs    = require 'fs'
jade  = require 'jade'

config = global.config

module.exports =
  sendTemplate: (senderAddress, template, options) ->
    if not config.email.enabled then return

    emailRoot = "#{global.root}/views/email"
    options.host = config.email.host

    # Render the plain-text version of the email
    # plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
    plainText = "" #plainTextTemplate options

    # Render the HTML version of the email
    htmlTemplate = jade.compileFile "#{emailRoot}/#{template}.jade"
    html = htmlTemplate options

    # Finally send the email
    @send options.subject, senderAddress, plainText, html


  send: (subject, senderAddress, plainText, html, attachments=[]) ->
    if not config.email.enabled then return

    # Connect to the SMTP server
    server = email.server.connect
      user: config.email.smtp.username
      password: config.email.smtp.password
      host: config.email.smtp.hostname
      ssl: config.email.smtp.ssl

    message = email.message.create
       from: config.email.fromAddress
       subject: subject,
       text: plainText
       to: senderAddress

    if html? then message.attach data: html, alternative: true
    message.attach attachment for attachment in attachments

    # Start sending the message
    server.send message