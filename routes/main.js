const express = require("express");
const router = express.Router({ mergeParams: true });
const isLoggedIn = require(__dirname + "/../utils/isLoggedIn");


// render the home page
router.get("/", function (req, res) {
    res.render("landing");
});

// account 
router.get("/account", isLoggedIn, (req, res) => {
    res.render("account");
});


module.exports = router;