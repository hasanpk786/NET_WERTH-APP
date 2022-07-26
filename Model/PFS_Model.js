const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PFS_Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  questions: [
    {
      questionIndex: {
        type: Number,
      },
      expenses: [
        {
          name: { type: String },
          value: { type: String },
        },
      ],

      answer: {
        type: String,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("PFS", PFS_Schema);
