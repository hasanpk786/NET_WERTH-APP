const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaModel = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("media", mediaModel);
