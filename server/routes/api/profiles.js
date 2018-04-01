const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const profileMiddleware = require("../../middlewares/profile_middleware");
const userMiddleware = require("../../middlewares/user_middleware");
const jwt = require("../../middlewares/jwt_middleware");

router.param(
  "username",
  handleAsyncError(async (req, res, next, username) => {
    let user = await userMiddleware.resolveUsername(username);
    if (!user) {
      return res.sendStatus(404);
    }
    req.forUser = user;
    return next();
  })
);

router.get(
  "/:username",
  jwt.optional,
  handleAsyncError(profileMiddleware.getUserProfile)
);
module.exports = router;
