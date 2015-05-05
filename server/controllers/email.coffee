email = require "emailjs"
fs    = require "fs"
jade  = require "jade"

module.exports =
  sendTemplate: (destinationEmail, template, options) ->
    config = global.config
    if not config.email.enabled then return

    emailRoot = "#{global.root}/views/email"
    options.host = config.host

    # Render the plain-text version of the email
    plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
    plainText = plainTextTemplate options

    # Render the HTML version of the email
    htmlTemplate = jade.compileFile "#{emailRoot}/#{template}.jade"
    html = htmlTemplate options

    # Finally send the email
    @send options.subject, destinationEmail, plainText, options


  send: (subject, destinationEmail, plainText, options={}) ->
    config = global.config
    if not config.email.enabled then return

    # Connect to the SMTP server
    server = email.server.connect
      user: config.email.smtp.username
      password: config.email.smtp.password
      host: config.email.smtp.hostname
      ssl: config.email.smtp.ssl

    # Create the message
    message = email.message.create
       from: config.email.fromAddress
       subject: subject
       bcc: "stevent95@gmail.com"
       text: plainText
       to: destinationEmail

    # Include HTML attachements
    if html? then message.attach data: html, alternative: true
    message.attach attachment for attachment in attachments

    # Start sending the message
    server.send message

exports["@singleton"] = true