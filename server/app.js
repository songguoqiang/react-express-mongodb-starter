require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  errorhandler = require("errorhandler"),
  mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  const isMongooseConnectionProvided = process.env.NODE_ENV === "integration";
  if (!isMongooseConnectionProvided) {
    mongoose.connect("mongodb://localhost/conduit");
    mongoose.set("debug", true);
  }
}

require("./models/User");
require("./config/passport");
app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use(function(err, req, res, next) {
    // development error handler
    // will print stacktrace
    //console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stack traces leaked to user
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

module.exports = app;
