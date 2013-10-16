var nodemailer = require("nodemailer"), config = require('./config');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    host: config.email.host,
    port: config.email.port,
    secureConnection: config.email.ssl,
    auth: {
        user: config.email.username,
        pass: config.email.password
    },
    debug: config.email.debug
});

var mailer = {

    sendMail: function (message, response) {
        // send the message and get a callback with an error or details of the message that was sent
        console.log(smtpTransport);
        smtpTransport.sendMail(message, response);
    }
}

module.exports = mailer;
