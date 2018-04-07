const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

const { mailgunAPIKey, mailgunDomain } = require("../config");

const mailgunOptions = {
  auth: {
    api_key: mailgunAPIKey,
    domain: mailgunDomain
  }
};

const transport = mailgunTransport(mailgunOptions);

class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(transport);
  }
  sendText(from, to, subject, text) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(
        {
          from,
          to,
          subject,
          text
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }
}

module.exports = new EmailService();
