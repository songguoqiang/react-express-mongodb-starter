const { port } = require("./config");
const app = require("./app");

const server = app.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log("Listening on port " + server.address().port);
});
