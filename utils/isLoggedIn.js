
// check if a user is logged in
module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "you have to login or sign-up to access this page");
        res.redirect("/login");
    }
}