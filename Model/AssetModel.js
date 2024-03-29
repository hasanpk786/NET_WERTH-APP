const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  assets: [
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

mongoose.model("Asset", AssetSchema);

// category:

// [
//     {
//         // car loan, bank loan etc.
//         categoryName: { type: String },

//         fields: [{
//             fieldName: {
//                 type: String,
//             },
//             value: {
//                 type: Number,
//             }

//         }],
//     }
// ],

/* preious model json
{
    "category": [
        {
            "categoryName": "Loans",
            "fields": [
                {
                    "fieldName": "Car Loan",
                    "value": 100
                }
            ]
        }
    ]
}
*/
