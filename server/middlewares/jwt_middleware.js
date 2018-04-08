const jwt = require("express-jwt");
const secret = require("../config").secret;

// the token may either be submitted via Authorization header or cookie
function getToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }

  return req.cookies.token;
}

module.exports = {
  required: jwt({
    secret: secret,
    userProperty: "jwt",
    getToken: getToken
  }),
  optional: jwt({
    secret: secret,
    userProperty: "jwt",
    credentialsRequired: false,
    getToken: getToken
  })
};
