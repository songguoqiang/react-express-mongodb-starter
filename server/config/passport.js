const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]"
    },
    async function(email, password, done) {
      try {
        let user = await User.findOne({ email: email });
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            msg: "Your email or password is invalid"
          });
        }
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
