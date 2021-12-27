const Comment = require(__dirname + "/../models/comment");

module.exports = async (req, res, next) => {
    if (req.isAuthenticated()) { // check if a user is logged in
        const foundComment = await Comment.findById(req.params.commentId).exec();

        if (foundComment.user.id.equals(req.user.id)) { // if logged in, check if they created the comment
            // if true show the edit form
            next()
        } else {
            res.redirect("back");  // if not, redirect back to show page
        }
    } else {
        req.flash("error", "you have to login or sign-up to access this page");
        res.redirect("/login");  // if not login redirect to /login
    }
}