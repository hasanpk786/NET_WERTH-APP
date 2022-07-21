const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LiabilitySchema = new Schema({
  categoryName: { type: String },

  fields: [
    {
      // car mantainence
      fieldName: {
        type: String,
      },
      value: {
        type: Number,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Liability", LiabilitySchema);
