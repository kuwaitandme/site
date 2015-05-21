email = require "emailjs"
fs    = require "fs"
jade  = require "jade"

exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"
  new class
    name: "[email]"
    sendTemplate: (destinationEmail, template, options={}) ->
      if not settings.email.enabled then return
      # Setup up some variables, that our template can use
      emailRoot = settings.email.templates.dir
      options.webmasterAddress = settings.email.webmasterAddress
      options.sitename =  settings.sitename
      options.url =  settings.url
      # Render the plain-text version of the email
      plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
      plainText = plainTextTemplate options
      # Render the HTML version of the email
      logger.debug @name, "rendering email template", template
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
        from: "#{settings.sitename} <#{settings.email.noreplyAddress}>"
        subject: subject
        bcc: settings.email.webmasterAddress
        text: plainText
        to: destinationEmail
      console.log
        from: "#{settings.sitename} <#{settings.email.noreplyAddress}>"
        subject: subject
        bcc: settings.email.webmasterAddress
        text: plainText
        to: destinationEmail
      # Include HTML attachements
      if options.html? then message.attach data: options.html, alternative: true
      message.attach attachment for attachment in (options.attachments or [])
      # Start sending the message
      logger.debug @name, "sending email to #{destinationEmail}"
      server.send message, (error, message) ->
        if error then logger.error error


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]