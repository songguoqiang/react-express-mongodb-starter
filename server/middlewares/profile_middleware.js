const User = require("../models/User");

async function getUserProfile(req, res) {
  let userInSession = undefined;
  if (req.jwt) {
    userInSession = await User.findById(req.jwt.userid);
  }

  let user = req.forUser;
  let publicProfile = user.getProfile(userInSession);
  return res.status(200).json({ profile: publicProfile });
}

module.exports = {
  getUserProfile
};
