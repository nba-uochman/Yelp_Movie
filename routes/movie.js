const express = require("express");
const router = express.Router({ mergeParams: true });
const Movie = require(__dirname + "/../models/movie.js");
const Comments = require(__dirname + "/../models/comment");
const isLoggedIn = require(__dirname + "/../utils/isLoggedIn");
const checkMovieOwner = require(__dirname + "/../utils/checkMovieOwner");


// render movie page
router.get("/", async (req, res) => {
    // console.log(req.user);
    try {
        const movies = await Movie.find();
        res.render("movie", { movies });
    } catch (err) {
        console.log(err);
        res.send("failed to find movies...");
    }

});

// post new movie to /movie route
router.post("/", async (req, res) => {
    console.log(req.user);
    const genre = req.body.genre.toLowerCase();

    const newMovie = new Movie({
        title: req.body.title,
        description: req.body.description,
        actors: req.body.actors,
        producer: req.body.producer,
        rating: req.body.rating,
        date: req.body.date,
        genre,
        image: req.body.image,
        owner: {
            id: req.user._id,
            username: req.user.username,
        }
    });

    try {
        const savedMovie = await newMovie.save();
        console.log(savedMovie);
        res.redirect(`/movie/${savedMovie.id}`);

    } catch (err) {
        console.log(err);
        res.send("failed to send");
    }

})

// add new movie
router.get("/new", isLoggedIn, function (req, res) {
    // console.log(req.user);
    res.render("new-movie");
});

// search the db index
router.get("/search", async (req, res) => {
    try {
        const movies = await Movie.find({
            $text: {
                $search: req.query.searchTerm
            }
        });

        res.render("movie", { movies })
    } catch (err) {
        console.log(err);
        res.send("failed to search")
    }
});

// show a single movie with details => show page
router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).exec()

        const comments = await Comments.find({ movieId: req.params.id }).exec();

        res.render("movie_show", { movie, comments });

    } catch (err) {
        console.log("an error occured " + err)
        res.send("failed to find movies");
    }

});

// edit route
router.get("/:id/edit", checkMovieOwner, async (req, res) => {
    if (req.isAuthenticated()) {  // check if a user is logged in
        const movie = await Movie.findById(req.params.id).exec();
        res.render("movie_edit", { movie });
    }

    // try {
    //     const movie = await Movie.findById(req.params.id).exec();
    //     console.log(movie.date);
    //     res.render("movie_edit", { movie });
    // } catch (err) {
    //     console.log(err);
    //     res.send("failed to find...")
    // }

});

// update route
router.put("/:id", checkMovieOwner, async (req, res) => {
    const genre = req.body.genre.toLowerCase();

    const movie = ({
        title: req.body.title,
        description: req.body.description,
        actors: req.body.actors,
        producer: req.body.producer,
        rating: req.body.rating,
        date: req.body.date,
        genre,
        image: req.body.image,
    });

    try {
        await Movie.findByIdAndUpdate(req.params.id, movie, { new: true }).exec();
        res.redirect(`/movie/${req.params.id}`);
    } catch (err) {
        console.log(err);
        res.send("failed to update...");
    }

});

// delete route
router.delete("/:id", checkMovieOwner, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id).exec();
        res.redirect(`/movie`);

    } catch (err) {
        console.log(err);
        res.send("failed to delete");
    }
});


module.exports = router;

