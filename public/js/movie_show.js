// *************************
// SELECTORS
// *************************
const upvoteBtn = document.getElementById("upvote-btn");
const downvoteBtn = document.getElementById("downvote-btn");
const score = document.getElementById("score");


// *************************
//  HELPER FUNCTION
// *************************
const sendVote = async (voteType) => {
    // set options for fetch api
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
    }

    if (voteType === "up") {
        options.body = JSON.stringify({ movieId, voteType: "up" });
    } else if (voteType === "down") {
        options.body = JSON.stringify({ movieId, voteType: "down" });
    } else {
        throw "vote type must be up or down";
    }

    // make fetch api post request

    const response = await fetch("/movie/vote", options)
        .then(data => data.json())
        .then(res => {
            console.log(res.response);
            handleVote(res.response.score, res.response.code);
        })
        .catch(err => console.log(err));

}

const handleVote = (newScore, code) => {
    score.innerHTML = newScore;

    if (code === 1) {
        upvoteBtn.classList.remove("btn-outline-success");
        upvoteBtn.classList.add("btn-success");

        downvoteBtn.classList.add("btn-outline-danger");
        downvoteBtn.classList.remove("btn-danger");
    } else if (code === -1) {
        downvoteBtn.classList.remove("btn-outline-danger");
        downvoteBtn.classList.add("btn-danger");

        upvoteBtn.classList.add("btn-outline-success");
        upvoteBtn.classList.remove("btn-success");
    } else if (code === 0) {
        upvoteBtn.classList.add("btn-outline-success");
        upvoteBtn.classList.remove("btn-success");

        downvoteBtn.classList.add("btn-outline-danger");
        downvoteBtn.classList.remove("btn-danger");
    } else {   // error
        console.log("error in handle vote");
    }

}

// *************************
// EVENTlISTENERS
// *************************

upvoteBtn.addEventListener("click", async () => {
    sendVote("up");
});

downvoteBtn.addEventListener("click", async () => {
    sendVote("down");
});



