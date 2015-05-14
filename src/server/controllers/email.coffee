email = require "emailjs"
fs    = require "fs"
jade  = require "jade"

exports = module.exports = (settings) -> new class

  sendTemplate: (destinationEmail, template, options={}) ->
    if not settings.email.enabled then return

    emailRoot = settings.email.templates.dir
    options.sitename =  settings.sitename
    options.url =  settings.url

    # Render the plain-text version of the email
    plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
    plainText = plainTextTemplate options

    # Render the HTML version of the email
    htmlTemplate = jade.compileFile "#{emailRoot}/#{template}.jade"
    options.html = htmlTemplate options

    # Finally send the email
    @send options.subject, destinationEmail, plainText, options


  send: (subject, destinationEmail, plainText, options={}) ->
    if not settings.email.enabled then return

    # Connect to the SMTP server
    server = email.server.connect
      user: settings.email.smtp.username
      password: settings.email.smtp.password
      host: settings.email.smtp.hostname
      ssl: settings.email.smtp.ssl

    # Create the message
    message = email.message.create
      from: settings.email.noreplyAddress
      subject: subject
      bcc: "stevent95@gmail.com"
      text: plainText
      to: destinationEmail

    # Include HTML attachements
    if options.html? then message.attach data: options.html, alternative: true
    message.attach attachment for attachment in (options.attachments or [])

    # Start sending the message
    server.send message


exports["@singleton"] = true
exports["@require"] = ["igloo/settings"]