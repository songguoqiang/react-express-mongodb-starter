/* eslint-disable no-console */

const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let mongoServer;

const setup = async () => {
  mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  const opts = {};
  await mongoose
    .connect(mongoUri, opts)
    .then(
      () => console.log("Mongo DB is ready."),
      error => console.error(error)
    );
};

const teardown = () => {
  mongoose.disconnect();
  mongoServer.stop();
};

module.exports = {
  setup,
  teardown
};
