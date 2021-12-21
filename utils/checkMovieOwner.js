const Movie = require(__dirname + "/../models/movie");

module.exports = async (req, res, next) => {
    if (req.isAuthenticated()) {  // check if a user is logged in
        const movie = await Movie.findById(req.params.id).exec();
        if (movie.owner.id.equals(req.user._id)) { // if logged in, check if they own the movie
            // if true show the edit form
            next();
        } else { // if not, redirect back to show page
            res.redirect(`back`);
        }
    } else {  // if not login redirect to /login
        res.redirect("/login");
    }

}