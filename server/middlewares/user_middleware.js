const User = require("../models/User");
const passport = require("passport");
const random = require("../utils/crypto_promise");
const mailer = require("../utils/email_service");
const {
  isLocal,
  frontendPort,
  systemEmailAddress,
  applicationName
} = require("../config");

async function registerNewUser(req, res) {
  const userFoundByEmail = await User.findOne({ email: req.body.user.email });
  if (userFoundByEmail) {
    return res.status(422).send({
      msg:
        "The email address you have entered is already associated with another account."
    });
  }

  var user = new User();

  user.name = req.body.user.name;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ token: user.generateJWT(), user: user.toJSON() });
}

function login(req, res, next) {
  if (!req.body.user.email) {
    return res.status(401).json({ msg: "The email address can't be blank" });
  }

  if (!req.body.user.password) {
    return res.status(401).json({ msg: "The password can't be blank" });
  }

  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ token: user.generateJWT(), user: user.toJSON() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
}

async function getCurrentUser(req, res) {
  const userId = req.jwt.userid;
  const user = await User.findById(userId);

  return res.status(200).json({ user: user.toJSON() });
}

async function updateCurrentUser(req, res) {
  const userId = req.jwt.userid;
  const user = await User.findById(userId);

  const newUserProfile = req.body.user;
  if (!newUserProfile) {
    return res.status(422).json({
      msg: "User profile information is not given."
    });
  }
  ["email", "name", "picture"].forEach(detail => {
    if (newUserProfile[detail]) {
      user[detail] = newUserProfile[detail];
    }
  });

  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }

  try {
    await user.save();

    if (newUserProfile.password) {
      return res.json({
        user: user.toJSON(),
        msg: "Your password is changed successfully."
      });
    } else {
      return res.json({
        user: user.toJSON(),
        msg: "Your profile is updated successfully."
      });
    }
  } catch (err) {
    return res.status(422).json({
      msg: "Your profile could not be updated"
    });
  }
}

async function deleteCurrentUser(req, res) {
  const userId = req.jwt.userid;
  await User.remove({ _id: userId });
  return res.json({
    msg: "Your account is deleted successfully."
  });
}

function getHostAndPort(req) {
  if (isLocal) {
    return "localhost:" + frontendPort;
  } else {
    return req.headers.host;
  }
}

async function sendPasswordResetEmail(req, res) {
  const token = await random(16);
  const toAddress = req.body.user.email;

  const user = await User.findOne({ email: toAddress });
  if (!user) {
    return res.status(400).send({
      msg: `The email address ${toAddress} is not associated with any account.`
    });
  }
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
  await user.save();

  const fromAddress = systemEmailAddress;
  const subject = "Reset Your Password for " + applicationName;
  const text =
    "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n" +
    "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
    "http://" +
    getHostAndPort(req) +
    "/reset/" +
    token +
    "\n\n" +
    "If you did not request this, please ignore this email and your password will remain unchanged.\n";
  mailer.sendText(fromAddress, toAddress, subject, text);

  res.send({
    msg:
      "An email has been sent to " + toAddress + " with further instructions."
  });
}

async function resetPassword(req, res) {
  const user = await User.findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec();

  if (!user) {
    return res
      .status(400)
      .send({ msg: "Password reset token is invalid or has expired." });
  }

  user.setPassword(req.body.user.password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const toAddress = user.email;
  const fromAddress = systemEmailAddress;
  const subject = "Your Password for " + applicationName + " has been changed";
  const text =
    "Hello,\n\n" +
    "This is a confirmation that the password for your account " +
    user.email +
    " has just been changed.\n";
  mailer.sendText(fromAddress, toAddress, subject, text);

  res.send({ msg: "Your password has been changed successfully." });
}

module.exports = {
  registerNewUser,
  login,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  sendPasswordResetEmail,
  resetPassword
};
