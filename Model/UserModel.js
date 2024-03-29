const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  goalNetWorth: {
    worth: {
      type: String,
      default: 0,
    },
    date: { type: Date },
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  assets: {
    type: Array,
  },
  liabilities: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("users", UserSchema);
