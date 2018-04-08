const { checkRequiredEnvironment } = require("./utils");

checkRequiredEnvironment(["FRONTEND_PORT"]);

module.exports = {
  frontendPort: process.env.FRONTEND_PORT
};
