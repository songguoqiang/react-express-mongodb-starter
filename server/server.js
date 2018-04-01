const app = require("./app");

const server = app.listen(process.env.PORT || 3001, function() {
  // eslint-disable-next-line no-console
  console.log("Listening on port " + server.address().port);
});
