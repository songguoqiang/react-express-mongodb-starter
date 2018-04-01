const jwt = require("express-jwt");
const secret = require("../config").secret;

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] === "Token") {
    return authHeader.split(" ")[1];
  }

  return null;
}

module.exports = {
  required: jwt({
    secret: secret,
    userProperty: "jwt",
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: "jwt",
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};
