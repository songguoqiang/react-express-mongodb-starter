const User = require("../models/User");
const passport = require("passport");

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

module.exports = {
  registerNewUser,
  login,
  getCurrentUser,
  updateCurrentUser
};
