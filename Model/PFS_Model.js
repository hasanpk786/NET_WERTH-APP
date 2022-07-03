const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PFS_Schema = new Schema({

    questions: [{
        question: {
            type: String,
        },

        answerIndex: {
            type: Number,
        },

        answer: {
            type: String,
        },
    }],

    date: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("PFS", PFS_Schema);