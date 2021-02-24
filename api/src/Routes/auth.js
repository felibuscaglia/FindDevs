const server = require("express").Router();
const { User } = require("../db.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

server.post("/register", async function (req, res, next) {
  try {
    const user = await User.create(req.body);
    const { id, username } = user;
    res.send(jwt.sign({ id, username }, "Crazygol1!"));
  } catch (error) {
    next (error)
  }
});

server.post("/login", function (req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (err) return next(err);
    else if (!user) return res.sendStatus(401);
    else return res.send(jwt.sign(user, "Crazygol1"))
  })(req, res, next)
});

module.exports = server;