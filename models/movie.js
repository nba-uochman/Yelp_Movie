const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    title: String,
    description: String,
    actors: String,
    producer: String,
    rating: Number,
    date: String,
    genre: String,
    image: String,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

movieSchema.index({
    "$**": "text"
})
module.exports = mongoose.model("Movie", movieSchema);