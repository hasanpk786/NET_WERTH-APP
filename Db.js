const mongoose = require("mongoose");
const connectDB = async () => {
  const uri =
    "mongodb+srv://admin:w5rv4la1XQkAXOEW@cluster0.kl3go.mongodb.net/?retryWrites=true&w=majority";
  const conn = await mongoose.connect(process.env.MONGOOSE_URI || uri, {
    useNewUrlParser: true,
  });
  console.log(`MongoDB Connected ${conn.connection.host}`);
};

module.exports = connectDB;
