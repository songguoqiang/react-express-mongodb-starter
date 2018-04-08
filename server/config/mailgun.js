const { checkRequiredEnvironment } = require("./utils");

checkRequiredEnvironment([
  "SYSTEM_EMAIL_ADDRESS",
  "APPLICATION_NAME",
  "MAILGUN_API_KEY",
  "MAILGUN_DOMAIN"
]);

module.exports = {
  systemEmailAddress: process.env.SYSTEM_EMAIL_ADDRESS,
  applicationName: process.env.APPLICATION_NAME,
  mailgunAPIKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN
};
