const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require(__dirname + "/../models/user");

// signup form - new
router.get("/signup", (req, res) => {
    res.render("sign_up");

});

//  signed up 
router.post("/signup", async (req, res) => {
    try {
        const newUser = await User.register(new User({
            email: req.body.email,
            username: req.body.username,
        }),
            req.body.password
        );

        passport.authenticate("local")(req, res, () => {
            res.redirect("/movie");
        });
    } catch (err) {
        console.log(err);
        res.send(err.message || err);
    }
});

// login form - new 
router.get("/login", (req, res) => {
    res.render("login");
});

// loged-in - post
router.post("/login", passport.authenticate("local", {
    successRedirect: "/movie",
    failureRedirect: "/login",
}));

// log out 
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;