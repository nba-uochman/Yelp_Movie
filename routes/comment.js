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
    console.log("post route ", req.user);
    const newComment = {
        user: {
            id: req.user._id,
            username: req.user.username
        },
        text: req.body.text,
        movieId: req.body.movieId,
    };

    await Comment.create(newComment);
    console.log(newComment)
    res.redirect("/movie/" + req.body.movieId);
});

// edit comment route
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
    if (req.isAuthenticated()) { // check if a user is logged in
        // find movie from database
        const foundComment = await Comment.findById(req.params.commentId).exec();
        res.render("comment_edit", { foundComment }); //render edit form
    }
    // try {
    //     const foundComment = await Comment.findById(req.params.commentId).exec();
    //     res.render("comment_edit", { foundComment });

    // } catch (err) {
    //     console.log(err);
    //     res.send("failed to load file");
    // }

});

// update comment route | PUT
router.put("/:commentId", checkCommentOwner, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.commentId, { text: req.body.text }, { new: true }).exec();
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
        res.redirect(`/movie/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("failed to load");
    }
});


module.exports = router;


