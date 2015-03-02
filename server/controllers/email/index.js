var email   = require("emailjs"),
	fs = require('fs'),
	jade = require('jade');

var config = global.config;

module.exports = {

	/**
	 * [sendTemplate description]
	 *
	 * @param  {[type]} senderAddress [description]
	 * @param  {[type]} template      [description]
	 * @param  {[type]} arguments     [description]
	 */
	sendTemplate: function(senderAddress, template, arguments) {
		var emailRoot = global.root + '/../server/views/email/';

		arguments.host = "https://kuwaitandme.com";

		/* Render the plain-text version of the email */
		var plainTextTemplate = jade.compileFile(emailRoot + "plaintext/" + template);
		var plainText = plainTextTemplate(arguments);

		/* Render the HTML version of the email */
		var htmlTemplate = jade.compileFile(emailRoot + template + '.jade');
		var html = htmlTemplate(arguments);

		this.send(arguments.subject, plainText, senderAddress, html);
	},


	/**
	 * [send description]
	 *
	 * @param  {[type]} subject       [description]
	 * @param  {[type]} plainText     [description]
	 * @param  {[type]} senderAddress [description]
	 * @param  {[type]} html          [description]
	 */
	send: function(subject, plainText, senderAddress, html) {
		console.log("sending email to ", senderAddress)
		/* Connect to the SMTP server */
		var server  = email.server.connect({
			user: config.email.smtp.username,
			password: config.email.smtp.password,
			host: config.email.smtp.hostname,
			ssl: config.email.smtp.ssl
		});

		/* Start sending the message */
		server.send({
			attachment: [ { data: html, alternative:true } ],
			from: config.email.fromAddress,
			subject: "Kuwait & Me - " + subject,
			text: plainText,
			to: senderAddress
		});
	}
}