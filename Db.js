const mongoose = require('mongoose');
const connectDB = async () => {
    const uri = "mongodb+srv://Hassan:Redalert3@cluster0.zl68z.mongodb.net/NetWerth?retryWrites=true&w=majority";
    const conn = await mongoose.connect(process.env.MONGOOSE_URI || uri, {
        useNewUrlParser: true,
    });
    console.log(`MongoDB Connected ${conn.connection.host}`);
};

module.exports = connectDB;