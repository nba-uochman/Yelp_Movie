// **********************
// IMPORTS
// **********************

// npm import
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const path = require("path");

// model import
const Movie = require(__dirname + "/models/movie");
const Comment = require(__dirname + "/models/comment");
const User = require(__dirname + "/models/user");

// router import
const mainRouter = require(__dirname + "/routes/main");
const movieRouter = require(__dirname + "/routes/movie");
const commentRouter = require(__dirname + "/routes/comment");
const authRouter = require(__dirname + "/routes/auth");


// config import
const config = require(__dirname + "/config");

// connect to db
mongoose.connect(config.db.connection);

// calls express
const app = express();

// **********************
// CONFIG
// **********************
// config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'))
app.set("view engine", "ejs");


// express session config
app.use(expressSession({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
}));

// passport config
app.use(passport.initialize());
app.use(passport.session());  // allows persistent session
passport.serializeUser(User.serializeUser()); // what data sholud be stored in seesion
passport.deserializeUser(User.deserializeUser()); //get the user data from the stored seesion
passport.use(new LocalStrategy(User.authenticate())); // use the local strategy


// current user middleware config
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

// **********************
// DEVELOPMENT
// **********************
app.use(morgan("tiny"));

// seed the DB
// const seed = require(__dirname + "/utils/seed");
// seed();

// use routes
app.use(mainRouter);
app.use(authRouter);
app.use("/movie", movieRouter);
app.use("/movie/:id/comments", commentRouter);

// static files
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap-icon/icons")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));

// **********************
// LISTEN
// **********************

app.listen(3000, function () {
    console.log("server running on port 3000");
});
