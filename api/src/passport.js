const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const { User } = require("./db.js");
const jwt = require("jsonwebtoken");

passport.use(
  new LocalStrategy (
    { usernameField: "username", passwordField: "password", session: false },
    async (username, password, done) => {
      const user = await User.findOne({ where: { username: username } });
      if (!user) return done(null, false);
      if (!user.compare(password)) return done(null, false);
      var {
        id,
        username
      } = user;
      return done(null, {
        id,
        username
      });
    }
  )
);

passport.use(
  new BearerStrategy ((token, done) => {
    jwt.verify(token, "Crazygol1!", function (err, user) {
      if (err) return done(err);
      return done(null, user ? user : false);
    });
  })
);

module.exports = passport;