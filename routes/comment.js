const express = require("express");
const Comment = require(__dirname + "/../models/comment");
const Movie = require(__dirname + "/../models/movie");
const router = express.Router({ mergeParams: true });
const isLoggedIn = require(__dirname + "/../utils/isLoggedIn");
const checkCommentOwner = require(__dirname + "/../utils/checkCommentOwner");

// create new comment route

router.get("/new/", function (req, res) {
    res.render("comment_new", { movieId: req.params.id });
});

// shows comments
router.post("/", isLoggedIn, async (req, res) => {
    const newComment = {
        user: {
            id: req.user._id,
            username: req.user.username
        },
        text: req.body.text,
        movieId: req.body.movieId,
    };

    await Comment.create(newComment);
    req.flash("success", "New Comment Created");
    res.redirect("/movie/" + req.body.movieId);
    console.log(newComment);
});

// edit comment route
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
    if (req.isAuthenticated()) { // check if a user is logged in
        // find movie from database
        const foundComment = await Comment.findById(req.params.commentId).exec();
        res.render("comment_edit", { foundComment }); //render edit form
    }

});

// update comment route | PUT
router.put("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.commentId, { text: req.body.text }, { new: true }).exec();
        req.flash("success", "Comment Updated")
        res.redirect(`/movie/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("failed to update");
    }

});

// delete comment 
router.delete("/:commentId/delete", checkCommentOwner, async (req, res) => {
    try {
        Comment.findByIdAndDelete(req.params.commentId).exec();
        req.flash("success", "Comment Deleted");
        res.redirect(`/movie/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("failed to load");
    }
});


module.exports = router;


