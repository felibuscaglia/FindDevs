const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const passport = require ("./passport");
const CORS = require ('cors');

require("./db.js");

const server = express();

server.name = "API";

server.use (CORS ())

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.use(passport.initialize());

server.all("*", function (req, res, next) {
  passport.authenticate("bearer", function (err, user) {
    if (err) return next(err);
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
});

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error("Console del Endware:", err);
  console.error ('Este es el field: ', err.field)
  res.status(status).json(err);
});
module.exports = server;
