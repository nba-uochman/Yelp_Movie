const Movie = require(__dirname + "/../models/movie");
const Comment = require(__dirname + "/../models/comment");
const mongoose = require("mongoose");

const date = new Date().toISOString().split("T")[0];
const movie_seeds = [
    {
        title: "Red Notice",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora quo cum possimus iusto repellendus quia? Voluptas officia quos quidem quia exercitationem perferendis doloremque dolor corporis!",
        actors: "Anthony Gils, Morgan Freeman, The Rock, Wood Stokham",
        producer: "Marvel",
        rating: 8,
        date: date,
        genre: "action",
        image: "/images/pic-1.png",
    },
    {
        title: "Free Guy",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora quo cum possimus iusto repellendus quia? Voluptas officia quos quidem quia exercitationem perferendis doloremque dolor corporis!",
        actors: "Anthony Gils, John Kennedy, Dwyne Johnson, Kim Hooler",
        producer: "Sony Entertaiment",
        rating: 7,
        date: date,
        genre: "sci-fi",
        image: "/images/pic-3.png",
    },
    {
        title: "Jungle Cruise",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora quo cum possimus iusto repellendus quia? Voluptas officia quos quidem quia exercitationem perferendis doloremque dolor corporis!",
        actors: "Merlin Kyler, Samson Dean, Micheal Goseman, Kim Hooler",
        producer: "Weaver Entertaiment",
        rating: 8,
        date: date,
        genre: "adventure",
        image: "/images/pic-6.png",
    }
];

const seed = async () => {
    // delete all current movies and comments
    await Movie.deleteMany();


    await Comment.deleteMany();

    // create three new movies
    // for (let movie_seed of movie_seeds) {

    //     const savedMovie = await Movie.create(movie_seed);

    //     // create a new comments for all three movies
    //     const comment = new Comment({
    //         user: "alex",
    //         text: "awesome movie...",
    //         movieId: savedMovie._id,
    //     });

    //     await comment.save();

    // }
}

module.exports = seed;