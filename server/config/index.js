const path = require("path");
const { checkRequiredEnvironment } = require("./utils");

checkRequiredEnvironment(["NODE_ENV"]);

const isProduction = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const isTest = process.env.NODE_ENV === "test";

if (isLocal) {
  require("dotenv").config();
} else if (isTest) {
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });
}

const envConfig = {
  isProduction,
  isLocal,
  isTest
};

const coreConfig = require("./core");
const mailgunConfig = require("./mailgun");
let localConfig = {};
if (isLocal) {
  localConfig = require("./local");
}

let testConfig = {};
if (isTest) {
  testConfig = require("./tests");
}

module.exports = Object.assign(
  {},
  envConfig,
  coreConfig,
  mailgunConfig,
  localConfig,
  testConfig
);
