const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "cannot be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "cannot be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    displayName: String,
    bio: String,
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
      username: this.username,
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

UserSchema.methods.toJSONWithAuthToken = function() {
  return {
    username: this.username,
    email: this.email,
    displayName: this.displayName,
    token: this.generateJWT(),
    bio: this.bio,
    gravatar: this.getGravatar()
  };
};

UserSchema.methods.toJSON = function() {
  return {
    username: this.username,
    email: this.email,
    displayName: this.displayName,
    bio: this.bio,
    gravatar: this.getGravatar()
  };
};

UserSchema.methods.getProfile = function(currentUserInSession) {
  return {
    username: this.username,
    bio: this.bio,
    gravatar: this.getGravatar(),
    following: false
  };
};

module.exports = mongoose.model("User", UserSchema);
