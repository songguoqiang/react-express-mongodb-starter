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

  const userFoundByName = await User.findOne({
    username: req.body.user.username
  });
  if (userFoundByName) {
    return res.status(422).send({
      msg:
        "The user name you have entered is already associated with another account."
    });
  }

  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ token: user.generateJWT(), user: user.toJSON() });
}

function login(req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: ["can't be blank"] } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: ["can't be blank"] } });
  }

  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({ token: user.generateJWT(), user: user.toJSON() });
    } else {
      return res.status(422).json(info);
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
      errors: { "user profile": "User profile information is not given." }
    });
  }
  ["email", "username", "bio", "displayName"].forEach(detail => {
    if (newUserProfile[detail]) {
      user[detail] = newUserProfile[detail];
    }
  });

  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }

  await user.save();
  return res.json({ user: user.toJSON() });
}

async function resolveUsername(username) {
  return await User.findOne({ username: username });
}

module.exports = {
  registerNewUser,
  login,
  getCurrentUser,
  updateCurrentUser,
  resolveUsername
};
