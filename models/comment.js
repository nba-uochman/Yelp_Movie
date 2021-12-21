const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    text: String,
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
});

module.exports = mongoose.model("Comment", commentSchema);