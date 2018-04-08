const { checkRequiredEnvironment } = require("./utils");

checkRequiredEnvironment(["PORT", "MONGODB_URI", "SECRET"]);

module.exports = {
  port: process.env.PORT,
  dbUri: process.env.MONGODB_URI,
  secret: process.env.SECRET
};
