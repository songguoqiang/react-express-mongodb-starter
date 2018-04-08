const router = require("express").Router();
const handleAsyncError = require("express-async-wrap");
const {
  registerNewUser,
  login,
  sendPasswordResetEmail,
  resetPassword,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser
} = require("../../controllers/user_controller");

const jwt = require("../../middlewares/jwt_middleware");

router.post("/users/signup", handleAsyncError(registerNewUser));

router.post("/users/login", login);

router.post("/user/forgot-password", handleAsyncError(sendPasswordResetEmail));

router.post("/user/reset-password/:token", handleAsyncError(resetPassword));

router.get("/user", jwt.required, handleAsyncError(getCurrentUser));

router.put("/user", jwt.required, handleAsyncError(updateCurrentUser));

router.delete("/user", jwt.required, handleAsyncError(deleteCurrentUser));

module.exports = router;
