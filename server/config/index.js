const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const isTest = process.env.NODE_ENV === "test";

if (isLocal) {
  require("dotenv").config();
} else if (isTest) {
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });
}

const isMongooseConnectionProvided = isTest;

module.exports = {
  isProduction,
  isLocal,
  isMongooseConnectionProvided,
  frontendPort: process.env.FRONTEND_PORT,
  port: process.env.PORT || 3001,
  dbUri: process.env.MONGODB_URI,
  secret: process.env.SECRET || "secret",
  systemEmailAddress: process.env.SYSTEM_EMAIL_ADDRESS,
  applicationName: process.env.APPLICATION_NAME,
  mailgunAPIKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN
};
