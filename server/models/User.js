const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "cannot be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    name: String,
    picture: String,
    hashedPassword: String,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "should be unique" });

UserSchema.methods.setPassword = function(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  this.hashedPassword = bcrypt.hashSync(password, salt);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      userid: this._id,
      name: this.name,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

UserSchema.methods.getGravatar = function() {
  if (!this.get("email")) {
    return "https://gravatar.com/avatar/?s=200&d=retro";
  }
  var md5 = crypto
    .createHash("md5")
    .update(this.get("email"))
    .digest("hex");
  return "https://gravatar.com/avatar/" + md5 + "?s=200&d=retro";
};

UserSchema.methods.toJSON = function() {
  return {
    name: this.name,
    email: this.email,
    picture: this.picture,
    gravatar: this.getGravatar()
  };
};

module.exports = mongoose.model("User", UserSchema);
