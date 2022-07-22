const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LiabilitiesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  liabilities: [
    {
      categoryName: { type: String },

      fields: [
        {
          // car mantainence
          fieldName: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Liability", LiabilitiesSchema);
