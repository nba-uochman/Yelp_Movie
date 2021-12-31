const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");
const Movie = require(__dirname + "/../models/movie.js");
const Comments = require(__dirname + "/../models/comment");
const isLoggedIn = require(__dirname + "/../utils/isLoggedIn");
const checkMovieOwner = require(__dirname + "/../utils/checkMovieOwner");


// render movie page
router.get("/", async (req, res) => {
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
        },
        upvote: [],
        downvote: []
    });

    try {
        const savedMovie = await newMovie.save();
        req.flash("success", "You Have Created A New Movie")
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

// search movie by genre
router.get("/genre/:genreId", async (req, res) => {
    try {
        const movies = await Movie.find({ genre: req.params.genreId }).exec();
        res.render("movie_genre.ejs", { movies });
        console.log(req.params.genreId);
    } catch (err) {
        console.log(err);
        res.send("CANNOT FIND MOVIE");
    }
});

// vote route
router.post("/vote", async (req, res) => {
    try {
        const movie = await Movie.findById(req.body.movieId).exec();

        const alreadyUpVoted = movie.upvote.indexOf(req.user.username);
        const alreadyDownVoted = movie.downvote.indexOf(req.user.username);

        let response = {};

        if (alreadyUpVoted === -1 && alreadyDownVoted === -1) { // has not voted
            if (req.body.voteType === "up") { //upvoting
                movie.upvote.push(req.user.username);
                movie.save();
                response = { message: "upvote tailed", code: 1 };
            } else if (req.body.voteType === "down") {  //downvoting
                movie.downvote.push(req.user.username);
                movie.save();
                response = { message: "downvote tailed", code: -1 };
            } else {
                response = { message: "error 1", code: "err" };
            }

        } else if (alreadyUpVoted >= 0) { // already upvoted
            if (req.body.voteType === "up") {
                movie.upvote.splice(alreadyUpVoted, 1);
                movie.save();
                response = { message: "upvote removed", code: 0 };

            }
            else if (req.body.voteType === "down") {
                movie.upvote.splice(alreadyUpVoted, 1);
                movie.downvote.push(req.user.username);
                movie.save();
                response = { message: "changed to downvote", code: -1 };
            } else {
                response = { message: "error 2", code: "err" };
            }

        } else if (alreadyDownVoted >= 0) { // already downvoted
            if (req.body.voteType === "up") {
                movie.downvote.splice(alreadyDownVoted, 1);
                movie.upvote.push(req.user.username);
                movie.save();
                response = { message: "changed to upvote", code: 1 };
            }
            else if (req.body.voteType === "down") {
                movie.downvote.splice(alreadyDownVoted, 1);
                movie.save();
                response = { message: "downvote removed", code: 0 };
            } else {
                response = { message: "error 3", code: 0 };
            }
        } else {  //error
            response = { message: "error 4", code: "err" };
        }

        // updated score before sending response
        response.score = movie.upvote.length - movie.downvote.length;

        res.json({ response });

    } catch (err) {
        console.log(err, "falied to send post");
    }


});

// show a single movie with details => show page
router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).exec();

        const comments = await Comments.find({ movieId: req.params.id }).exec();

        res.render("movie_show", { movie, comments, ownerId: movie.owner.id, userId: req.user.id });
        // console.log(movie, req.user.id);

    } catch (err) {
        console.log("an error occured " + err)
        res.send("failed to find movies");
    }

});

// trailer route
router.get("/:id/trailer", async (request, response) => {
    const apikey = "k_fng8k947"
    try {
        const findMovie = await Movie.findById(request.params.id).exec();
        console.log(findMovie.title);
        const expression = findMovie.title
        const url = `https://imdb-api.com/en/API/SearchMovie/${apikey}/${expression}`;

        //  api fetch
        const res = await axios.get(url)
        const data = res.data;
        console.log(data);
        data.results.forEach(async (result) => {  // iterate through all movie result
            const typedMovie = expression.toLowerCase()
            console.log(typedMovie);
            const searchedMovie = result.title.toLowerCase();
            console.log(searchedMovie);
            // if any result title is equall to expression
            if (searchedMovie === typedMovie) {
                const getById = await axios.get(`https://imdb-api.com/en/API/Trailer/${apikey}/${result.id}`);
                const linkEmbed = getById.data.linkEmbed;
                console.log(getById.data, linkEmbed);
                if (linkEmbed === null) {
                    response.render("movie_trailer", { linkEmbed, linkEmbedError: getById.data.errorMessage });
                } else if (linkEmbed) {
                    response.render("movie_trailer", { linkEmbed, linkEmbedError: getById.data.errorMessage });
                }
            }

        });

    } catch (err) {
        console.log(err, " cannot fetch");
    }
})

// edit route
router.get("/:id/edit", checkMovieOwner, async (req, res) => {
    if (req.isAuthenticated()) {  // check if a user is logged in
        const movie = await Movie.findById(req.params.id).exec();
        res.render("movie_edit", { movie });
    }
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
        req.flash("success", "Movie Edit Successfully");
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
        req.flash("success", "Movie deleted");
        res.redirect(`/movie`);

    } catch (err) {
        console.log(err);
        res.send("failed to delete");
    }
});


module.exports = router;

