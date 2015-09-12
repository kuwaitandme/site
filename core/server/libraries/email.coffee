Promise       = require "bluebird"
_             = require "underscore"
email         = require "emailjs"
fs            = require "fs"
jade          = require "jade"
nodemailer    = require "nodemailer"
smtpTransport = require "nodemailer-smtp-transport"


###
This module is responsible for making sure that the emails gets rendered
and sent properly. In development mode, email is disabled.

This is just basically an interface to emailjs. But takes care of all the
settings, authentication, error and brings it up as a nice promise-based
function.

Steven Enamakel <me@steven.pw>
###
exports = module.exports = (IoC, settings) ->
  name = "[email]"
  logger = IoC.create "igloo/logger"

  transporter = nodemailer.createTransport
    # host: settings.email.smtp.hostname
    # port: settings.email.smtp.port or 25
    # secure: settings.email.smtp.ssl
    service: "Gmail"
    auth:
      user: settings.email.smtp.username
      pass: settings.email.smtp.password


  # Setup some defaults
  defaultJadeOptions =
    sitename: settings.sitename
    url: settings.url
    webmasterAddress: settings.email.webmasterAddress


  # Grab the email root
  emailRoot = settings.email.templates.dir


  ###
  Use this function to get a jade email template, render it and then
  send it as an email (along with the different options given).

  @param  String destination           The destination email address to
                                       which this email is to be sent.
  @param  String template              The relative URL to the the template
                                       (wrt to /views/email).
  @param  Object templateOptions       The options that get sent to the
                                       jade renderer.
  @return Promise                      A promise resolving iff the email
                                       was sent successfully
  @example
  instance.sendTemplate("abd@mail.com", "account/activate",
    {subject: "Hello World"});
  ###
  sendTemplate = (subject, destination, template, templateOptions={},
  emailOptions={}) ->
    if not settings.email.enabled then return Promise.resolve()

    # Extend the default options
    jadeOptions = _.extend defaultJadeOptions, templateOptions

    # Render the plain-text version of the email
    plainTextTemplate = jade.compileFile "#{emailRoot}/plaintext/#{template}"
    plainText = plainTextTemplate jadeOptions

    # Render the HTML version of the email
    logger.debug name, "rendering email template", template
    htmlTemplate = jade.compileFile "#{emailRoot}/#{template}.jade"
    html = htmlTemplate jadeOptions

    # Attach the html to the email options
    emailOptions.html = html

    # Finally send the email
    send subject, destination, plainText, emailOptions


  ###
  This function sends a simple text email. It also takes in extra options
  such an options HTML text and extra attachments.

  @param  String subject            The subject that gets sent in the
                                    email.
  @param  String destination        The destination address that gets sent
                                    in the email.
  @param  String message            The actual message gets sent.
  @param  Object options            The options for the message. It takes
                                    in a html option used to attach
                                    a html text and can also override the
                                    default options.

  @return Promise                   A promise that resolves iff the email
                                    got sent out successfully.
  ###
  send = (subject, destination, message, mailOptions={}) ->
    new Promise (resolve, reject) ->
      if not settings.email.enabled then return resolve()

      defaultsMailOptions =
        from: "#{settings.sitename} <#{settings.email.noreplyAddress}>"
        subject: subject
        bcc: settings.email.webmasterAddress
        text: message
        to: destination

      # Extend the default options
      options = _.extend {}, defaultsMailOptions, mailOptions

      # Start sending the message
      logger.debug name, "sending email to #{destination}"
      transporter.sendMail options, (error, info) ->
        if error then reject error
        else resolve info

  send: send
  sendTemplate: sendTemplate


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]